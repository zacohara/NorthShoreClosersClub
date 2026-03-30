// Speed to Lead — Netlify function
// Computes per-rep: speed metric, overdue todos, estimates to ship
// Refreshes at 8am/6pm CST via schedule, or on-demand via POST
// Stores results in Supabase speed_cache table
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const JT_API = "https://api.jobtread.com/pave";
const JT_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG = "22NvNEMpKBmy";

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

// Count days between two dates, excluding Sundays, inclusive of both ends
function countSpeed(taskDateStr, estDateStr) {
  const start = new Date(taskDateStr + "T00:00:00");
  const end = new Date(estDateStr + "T00:00:00");
  if (end < start) return 0;
  let days = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() !== 0) days++;
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

async function pave(query) {
  try {
    const r = await fetch(JT_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${JT_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: JT_ORG, query: { organization: { $: { id: JT_ORG }, ...query } } })
    });
    const d = await r.json();
    return d?.organization || {};
  } catch (e) {
    return {};
  }
}

async function searchJobsWithDetails(searchTerm) {
  const jobsQuery = {
    nodes: {
      id: {}, name: {},
      customFieldValues: { customField: { id: {}, name: {} }, values: {} },
      tasks: { nodes: { id: {}, startDate: {}, endDate: {}, isToDo: {}, progress: {}, assignedMemberships: { nodes: { id: {} } } } },
      documents: { nodes: { id: {}, type: {}, status: {}, createdAt: {} } }
    }
  };
  if (searchTerm) {
    jobsQuery.$ = { where: { like: [{ field: ["name"] }, { value: `%${searchTerm}%` }] } };
  }
  const result = await pave({ jobs: jobsQuery });
  return result?.jobs?.nodes || [];
}

async function getIncompleteTasks(isToDo) {
  const result = await pave({
    tasks: {
      $: { where: { and: [
        { "=": [{ field: ["isGroup"] }, { value: false }] },
        { "<": [{ field: ["progress"] }, { value: 1 }] },
        { "=": [{ field: ["isToDo"] }, { value: isToDo }] },
      ]}},
      nodes: { id: {}, endDate: {}, progress: {},
        assignedMemberships: { nodes: { id: {} } },
        job: { name: {} }
      }
    }
  });
  return result?.tasks?.nodes || [];
}

function getJobCFV(job, fieldId) {
  const cfvs = job?.customFieldValues || [];
  for (const cfv of cfvs) {
    if (cfv?.customField?.id === fieldId) return cfv?.values?.[0] || null;
  }
  return null;
}

async function computeSpeedData() {
  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date(Date.now() - 180 * 86400000).toISOString().split("T")[0];

  const searchTerms = [
    "", "masonry", "tuck", "chimney", "brick", "estimate",
    "concrete", "lintel", "stone", "repair", "facade",
    "porch", "step", "retaining", "foundation", "roof",
    "wall", "caulk", "block", "rebuild", "exterior",
    "leak", "water", "sill", "stucco", "balcon",
  ];

  const allJobs = new Map();
  for (const term of searchTerms) {
    const jobs = await searchJobsWithDetails(term);
    for (const j of jobs) {
      if (j.id && !allJobs.has(j.id)) allJobs.set(j.id, j);
    }
  }

  const [todos, scheduled] = await Promise.all([
    getIncompleteTasks(true),
    getIncompleteTasks(false)
  ]);
  const allTasks = [...todos, ...scheduled];

  // Load existing speed_raw from Supabase
  let existingRaw = [];
  try {
    const { data } = await supabase.from("speed_raw").select("*");
    existingRaw = data || [];
  } catch (e) { /* table might not exist */ }

  // Extract speed data points from fetched jobs
  const newRawRows = [];
  for (const [jobId, job] of allJobs) {
    const repName = getJobCFV(job, "22Nx8AjZSNmw");
    if (!repName) continue;

    const tasks = job.tasks?.nodes || [];
    const docs = job.documents?.nodes || [];

    // First scheduled task date (the date the task is scheduled FOR, not created)
    const taskDates = tasks.map(t => t.startDate || t.endDate).filter(Boolean).sort();
    const firstTaskDate = taskDates[0] || null;

    // First customerOrder reaching pending/approved
    const estDocs = docs
      .filter(d => d.type === "customerOrder" && (d.status === "pending" || d.status === "approved"))
      .map(d => d.createdAt?.split("T")[0])
      .filter(Boolean)
      .sort();
    const firstEstDate = estDocs[0] || null;

    if (firstTaskDate && firstEstDate && firstTaskDate <= firstEstDate) {
      const speed = countSpeed(firstTaskDate, firstEstDate);
      if (speed > 0 && speed < 120) {
        newRawRows.push({
          job_id: jobId, rep: repName, job_name: job.name || "",
          task_date: firstTaskDate, estimate_date: firstEstDate, speed_days: speed,
        });
      }
    }
  }

  // Upsert new raw data
  if (newRawRows.length > 0) {
    try { await supabase.from("speed_raw").upsert(newRawRows, { onConflict: "job_id" }); } catch (e) {}
  }

  // Reload all raw data
  let allRaw = newRawRows;
  try {
    const { data } = await supabase.from("speed_raw").select("*");
    if (data && data.length > 0) allRaw = data;
  } catch (e) {}

  // Load existing cache
  let existingCache = null;
  try {
    const { data } = await supabase.from("speed_cache").select("*").eq("id", "current").single();
    existingCache = data;
  } catch (e) {}

  const personalBests = existingCache?.personal_bests || {};

  // Compute per-rep
  const repData = [];
  for (const rep of REPS) {
    const repRaw = allRaw.filter(r => r.rep === rep.jt && r.task_date >= sixMonthsAgo);
    const speeds = repRaw.map(r => r.speed_days);
    const avgSpeed = speeds.length > 0 ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length * 10) / 10 : null;
    const bestRaw = repRaw.length > 0 ? repRaw.reduce((best, r) => r.speed_days < best.speed_days ? r : best) : null;

    // Overdue todos
    const overdue = allTasks.filter(t => {
      const assignees = t.assignedMemberships?.nodes || [];
      return assignees.some(a => a.id === rep.mid) && t.endDate && t.endDate < today && t.progress < 1;
    }).length;

    // Estimates to ship
    let toShip = 0;
    for (const [, job] of allJobs) {
      if (getJobCFV(job, "22Nx8AjZSNmw") !== rep.jt) continue;
      const status = getJobCFV(job, "22NzE5gAPktJ") || "";
      if (status.startsWith("03")) {
        toShip++;
      } else if (status.startsWith("02")) {
        const tasks = job.tasks?.nodes || [];
        if (tasks.some(t => t.startDate === today || t.endDate === today)) toShip++;
      }
    }

    // Personal best
    let pb = personalBests[rep.name] || null;
    let newPB = false;
    if (bestRaw && (!pb || bestRaw.speed_days < pb.speed)) {
      pb = { speed: bestRaw.speed_days, job: bestRaw.job_name, date: bestRaw.estimate_date };
      personalBests[rep.name] = pb;
      newPB = true;
    }

    repData.push({
      name: rep.name, fullName: rep.jt, mid: rep.mid,
      speed: avgSpeed, speedSamples: speeds.length,
      overdue, toShip, personalBest: pb, newPersonalBest: newPB,
    });
  }

  repData.sort((a, b) => {
    if (a.speed === null && b.speed === null) return 0;
    if (a.speed === null) return 1;
    if (b.speed === null) return -1;
    return a.speed - b.speed;
  });
  repData.forEach((r, i) => { r.rank = i + 1; });

  // Monday snapshot
  const dayOfWeek = new Date().getDay();
  let prevWeek = existingCache?.prev_week || null;
  if (dayOfWeek === 1 && existingCache?.reps?.length > 0) {
    prevWeek = existingCache.reps;
  }

  const cacheRow = {
    id: "current",
    reps: repData,
    personal_bests: personalBests,
    prev_week: prevWeek,
    computed_at: new Date().toISOString(),
  };

  try { await supabase.from("speed_cache").upsert(cacheRow, { onConflict: "id" }); } catch (e) {}

  return cacheRow;
}

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") return new Response("", { status: 200, headers });

  if (req.method === "GET") {
    try {
      const { data } = await supabase.from("speed_cache").select("*").eq("id", "current").single();
      return new Response(JSON.stringify(data || { reps: [], computed_at: null }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ reps: [], computed_at: null }), { status: 200, headers });
    }
  }

  try {
    const result = await computeSpeedData();
    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
};
