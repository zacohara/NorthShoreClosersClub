const JT_API_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG_ID = "22NvNEMpKBmy";
const REPS = [
  { name: "Les", jt: "Les O'Hara", mid: "22Nwt8wGjTEx" },
  { name: "Luke", jt: "Luke Bergman", mid: "22P92SdAQUQE" },
  { name: "Jace", jt: "Jace O'Hara", mid: "22PTSGV5U7Rj" },
  { name: "Paul", jt: "Paul Boidanis", mid: "22PGVz57tzke" },
  { name: "Carlos", jt: "Carlos Celleri", mid: "22NxzADWDVVA" },
  { name: "Devin", jt: "Devin O'Hara", mid: "22NztygQhunB" },
  { name: "BJ", jt: "BJ Tippmann", mid: "22PHDEMpwFKR" },
  { name: "Cortney", jt: "Cortney Campbell", mid: "22NxBXSxWBRq" },
];
const CF_STATUS = "22NzE5gAPktJ";
const CF_REP = "22Nx8AjZSNmw";

function countSpeed(taskDate, estDate) {
  const s = new Date(taskDate+"T00:00:00"), e = new Date(estDate+"T00:00:00");
  if (e < s) return 0;
  let days = 0, c = new Date(s);
  while (c <= e) { if (c.getDay() !== 0) days++; c.setDate(c.getDate() + 1); }
  return days;
}

async function pave(query) {
  const r = await fetch("https://api.jobtread.com/pave", {
    method: "POST",
    headers: { "Authorization": "Bearer " + JT_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId: JT_ORG_ID, query: { organization: { $: { id: JT_ORG_ID }, ...query } } })
  });
  try { const d = await r.json(); return d.organization || {}; } catch { return {}; }
}

function getCFV(nodes, fid) {
  if (!nodes) return null;
  for (const c of nodes) {
    if (c && c.customField && c.customField.id === fid) return (c.values && c.values[0]) || c.value || null;
  }
  return null;
}

exports.handler = async (event) => {
  const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: H, body: "" };

  try {
    const today = new Date().toISOString().split("T")[0];
    const sixAgo = new Date(Date.now() - 180*86400000).toISOString().split("T")[0];

    const docNode = { createdAt: {}, status: {}, type: {},
      job: { id: {}, name: {},
        tasks: { nodes: { startDate: {}, endDate: {} } },
        customFieldValues: { nodes: { value: {}, customField: { id: {} } } }
      }
    };

    // Batch 1: tasks + date-filtered document queries (parallel)
    const dateRanges = [2, 4, 6].map(m => {
      const d = new Date(); d.setMonth(d.getMonth() - m);
      return d.toISOString().split("T")[0];
    });

    const batch1 = await Promise.all([
      pave({ tasks: { $: { where: { and: [
        { "=": [{ field: ["isGroup"] }, { value: false }] },
        { "<": [{ field: ["progress"] }, { value: 1 }] },
        { "=": [{ field: ["isToDo"] }, { value: true }] },
      ]}}, nodes: { id: {}, endDate: {}, progress: {}, assignedMemberships: { nodes: { id: {} } } } } }),
      pave({ tasks: { $: { where: { and: [
        { "=": [{ field: ["isGroup"] }, { value: false }] },
        { "<": [{ field: ["progress"] }, { value: 1 }] },
        { "=": [{ field: ["isToDo"] }, { value: false }] },
      ]}}, nodes: { id: {}, startDate: {}, endDate: {}, progress: {}, assignedMemberships: { nodes: { id: {} } },
        job: { name: {}, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } }
      } } }),
      ...dateRanges.flatMap(dateStr =>
        ["pending", "approved"].map(status =>
          pave({ documents: { $: { where: { and: [
            { "=": [{ field: ["type"] }, { value: "customerOrder" }] },
            { "=": [{ field: ["status"] }, { value: status }] },
            { ">": [{ field: ["createdAt"] }, { value: dateStr }] },
          ]}}, nodes: docNode } })
        )
      ),
    ]);

    const allTasks = [...(batch1[0].tasks?.nodes||[]), ...(batch1[1].tasks?.nodes||[])];
    const allDocs = batch1.slice(2).flatMap(b => b.documents?.nodes || []);

    // Batch 2: job searches for estimates-to-ship (sequential batches of 5)
    const jobNode = { id: {}, name: {},
      tasks: { nodes: { startDate: {}, endDate: {} } },
      customFieldValues: { nodes: { value: {}, customField: { id: {} } } },
      documents: { nodes: { type: {}, status: {}, createdAt: {} } }
    };
    const terms = ["", "masonry", "tuck", "chimney", "brick", "estimate",
      "concrete", "lintel", "stone", "facade", "porch", "step",
      "retaining", "foundation", "wall", "caulk", "block", "rebuild", "exterior", "leak", "roof"];

    const allJobs = new Map();
    for (let i = 0; i < terms.length; i += 5) {
      const results = await Promise.all(terms.slice(i, i+5).map(t => {
        const q = { nodes: jobNode };
        if (t) q.$ = { where: { like: [{ field: ["name"] }, { value: "%"+t+"%" }] } };
        return pave({ jobs: q });
      }));
      for (const r of results)
        for (const j of (r.jobs?.nodes || []))
          if (j.id && !allJobs.has(j.id)) allJobs.set(j.id, j);
    }

    // --- SPEED from documents ---
    const speedPts = new Map();
    for (const doc of allDocs) {
      if (doc.type !== "customerOrder") continue;
      const job = doc.job;
      if (!job?.id || speedPts.has(job.id)) continue;
      const docDate = (doc.createdAt||"").slice(0,10);
      if (docDate < sixAgo) continue;
      const rep = getCFV(job.customFieldValues?.nodes, CF_REP);
      if (!rep) continue;
      const td = (job.tasks?.nodes||[]).map(t=>t.startDate||t.endDate).filter(Boolean).map(d=>d.slice(0,10)).sort();
      if (!td.length) continue;
      const sp = countSpeed(td[0], docDate);
      if (sp > 0 && sp < 120) speedPts.set(job.id, { rep, speed: sp, jobName: job.name, date: docDate });
    }

    // Speed from job-based queries too
    for (const [id, job] of allJobs) {
      if (speedPts.has(id)) continue;
      const rep = getCFV(job.customFieldValues?.nodes, CF_REP);
      if (!rep) continue;
      const docs = (job.documents?.nodes||[])
        .filter(d => d.type==="customerOrder" && (d.status==="pending"||d.status==="approved"))
        .map(d => (d.createdAt||"").slice(0,10)).filter(Boolean).sort();
      if (!docs.length || docs[0] < sixAgo) continue;
      const td = (job.tasks?.nodes||[]).map(t=>t.startDate||t.endDate).filter(Boolean).map(d=>d.slice(0,10)).sort();
      if (!td.length) continue;
      const sp = countSpeed(td[0], docs[0]);
      if (sp > 0 && sp < 120) speedPts.set(id, { rep, speed: sp, jobName: job.name, date: docs[0] });
    }

    // --- LEADERBOARD ---
    const leaderboard = REPS.map(rep => {
      const pts = [...speedPts.values()].filter(s => s.rep === rep.jt);
      const avg = pts.length ? Math.round(pts.reduce((a,b) => a+b.speed, 0) / pts.length * 10) / 10 : null;
      const best = pts.length ? pts.reduce((a,b) => a.speed < b.speed ? a : b) : null;
      const overdue = allTasks.filter(t =>
        t.endDate && t.endDate < today && t.progress < 1 &&
        (t.assignedMemberships?.nodes||[]).some(a => a.id === rep.mid)
      ).length;
      let toShip = 0;
      for (const [,j] of allJobs) {
        if (getCFV(j.customFieldValues?.nodes, CF_REP) !== rep.jt) continue;
        const st = getCFV(j.customFieldValues?.nodes, CF_STATUS) || "";
        if (st.startsWith("03")) toShip++;
        else if (st.startsWith("02") && (j.tasks?.nodes||[]).some(t => (t.startDate||t.endDate||"").slice(0,10) === today)) toShip++;
      }
      return {
        name: rep.name, fullName: rep.jt,
        speed: avg, samples: pts.length, overdue, toShip,
        personalBest: best ? { days: best.speed, job: best.jobName, date: best.date } : null,
      };
    });

    leaderboard.sort((a,b) => {
      if (a.speed===null && b.speed===null) return 0;
      if (a.speed===null) return 1;
      if (b.speed===null) return -1;
      return a.speed - b.speed;
    });

    return { statusCode: 200, headers: H, body: JSON.stringify({
      leaderboard, computedAt: new Date().toISOString(),
      jobsScanned: allJobs.size, speedPoints: speedPts.size, tasksFetched: allTasks.length,
    })};
  } catch (e) {
    return { statusCode: 500, headers: H, body: JSON.stringify({ error: e.message }) };
  }
};
