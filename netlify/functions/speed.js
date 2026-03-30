const JT_API_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG_ID = "22NvNEMpKBmy";
const CF_STATUS_ID = "22NzE5gAPktJ";
const CF_SALES_REP_ID = "22Nx8AjZSNmw";

// Sales team membership IDs (for task assignment matching)
const REPS = [
  { name: "Les", fullName: "Les O'Hara", mid: "22Nwt8wGjTEx" },
  { name: "Luke", fullName: "Luke Bergman", mid: "22P92SdAQUQE" },
  { name: "Jace", fullName: "Jace O'Hara", mid: "22PTSGV5U7Rj" },
  { name: "Paul", fullName: "Paul Boidanis", mid: "22PGVz57tzke" },
  { name: "Carlos", fullName: "Carlos Celleri", mid: "22NxzADWDVVA" },
  { name: "Devin", fullName: "Devin O'Hara", mid: "22NztygQhunB" },
  { name: "BJ", fullName: "BJ Tippmann", mid: "22PHDEMpwFKR" },
  { name: "Cortney", fullName: "Cortney Campbell", mid: "22NxBXSxWBRq" },
];

async function pave(query) {
  const resp = await fetch("https://api.jobtread.com/pave", {
    method: "POST",
    headers: { "Authorization": `Bearer ${JT_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId: JT_ORG_ID, query: { organization: { $: { id: JT_ORG_ID }, ...query } } })
  });
  const text = await resp.text();
  try { return JSON.parse(text); } catch { return null; }
}

// Count days between two dates, inclusive of both, excluding Sundays (day 0)
function countDaysExSunday(startStr, endStr) {
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  if (isNaN(start) || isNaN(end) || end < start) return null;
  let days = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() !== 0) days++; // 0 = Sunday
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function todayStr() {
  // CST = UTC-6 (simplified, ignoring DST)
  const now = new Date();
  const cst = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  return cst.toISOString().split("T")[0];
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const today = todayStr();

    // Parallel PAVE queries to gather data
    const [
      todosResult,
      scheduledResult,
      pendingDocs,
      approvedDocs,
      plainJobs,
      recentJobs
    ] = await Promise.all([
      // 1. All incomplete to-do tasks (for overdue count)
      pave({ tasks: { $: { where: { and: [
        { "=": [{ field: ["isGroup"] }, { value: false }] },
        { "<": [{ field: ["progress"] }, { value: 1 }] },
        { "=": [{ field: ["isToDo"] }, { value: true }] }
      ]}}, nodes: { id: {}, endDate: {}, progress: {}, assignedMemberships: { nodes: { id: {} } }, job: { name: {} } } } }),

      // 2. All incomplete scheduled tasks
      pave({ tasks: { $: { where: { and: [
        { "=": [{ field: ["isGroup"] }, { value: false }] },
        { "<": [{ field: ["progress"] }, { value: 1 }] },
        { "=": [{ field: ["isToDo"] }, { value: false }] }
      ]}}, nodes: { id: {}, startDate: {}, endDate: {}, progress: {}, assignedMemberships: { nodes: { id: {} } }, job: { name: {}, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } } } } }),

      // 3. Pending customerOrder documents with job tasks + cfv
      pave({ documents: { $: { where: { and: [
        { "=": [{ field: ["type"] }, { value: "customerOrder" }] },
        { "=": [{ field: ["status"] }, { value: "pending" }] }
      ]}}, nodes: { createdAt: {}, job: { id: {}, name: {}, tasks: { nodes: { startDate: {}, endDate: {}, isToDo: {} } }, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } } } } }),

      // 4. Approved customerOrder documents with job tasks + cfv
      pave({ documents: { $: { where: { and: [
        { "=": [{ field: ["type"] }, { value: "customerOrder" }] },
        { "=": [{ field: ["status"] }, { value: "approved" }] }
      ]}}, nodes: { createdAt: {}, closedAt: {}, job: { id: {}, name: {}, tasks: { nodes: { startDate: {}, endDate: {}, isToDo: {} } }, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } } } } }),

      // 5. Plain jobs (for status distribution)
      pave({ jobs: { nodes: { id: {}, name: {}, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } } } }),

      // 6. Jobs with "estimate" in name (different batch)
      pave({ jobs: { $: { where: { like: [{ field: ["name"] }, { value: "%Estimate%" }] } }, nodes: { id: {}, name: {}, tasks: { nodes: { startDate: {}, endDate: {} } }, customFieldValues: { nodes: { value: {}, customField: { id: {} } } } } } }),
    ]);

    // Extract helper
    const getCfv = (cfvNodes, fieldId) => {
      if (!cfvNodes) return null;
      const match = cfvNodes.find(c => c?.customField?.id === fieldId);
      return match?.value || null;
    };

    // Initialize per-rep data
    const repData = {};
    REPS.forEach(r => {
      repData[r.name] = {
        name: r.name,
        fullName: r.fullName,
        mid: r.mid,
        overdueTodos: 0,
        estimatesToShip: 0,
        speedSamples: [],
        speedAvg: null,
      };
    });

    // 1. Count overdue to-dos per rep
    const allTasks = [
      ...(todosResult?.organization?.tasks?.nodes || []),
      ...(scheduledResult?.organization?.tasks?.nodes || [])
    ];

    for (const task of allTasks) {
      if (!task.endDate || task.progress >= 1) continue;
      const assignees = task.assignedMemberships?.nodes || [];
      const isOverdue = task.endDate < today;

      for (const rep of REPS) {
        if (assignees.some(a => a.id === rep.mid)) {
          if (isOverdue && task.endDate) {
            // Only count to-dos as overdue, not scheduled tasks
            repData[rep.name].overdueTodos++;
          }
        }
      }
    }

    // 2. Count estimates to ship per rep
    // Status 03 jobs = all count. Status 02 jobs = only if task scheduled today
    const allJobNodes = [
      ...(plainJobs?.organization?.jobs?.nodes || []),
      ...(recentJobs?.organization?.jobs?.nodes || [])
    ];

    const seenJobIds = new Set();
    for (const job of allJobNodes) {
      if (!job.id || seenJobIds.has(job.id)) continue;
      seenJobIds.add(job.id);

      const cfvNodes = job.customFieldValues?.nodes || [];
      const status = getCfv(cfvNodes, CF_STATUS_ID) || "";
      const salesRep = getCfv(cfvNodes, CF_SALES_REP_ID) || "";
      const rep = REPS.find(r => r.fullName === salesRep);
      if (!rep) continue;

      if (status.startsWith("03")) {
        repData[rep.name].estimatesToShip++;
      } else if (status.startsWith("02")) {
        // Check if any task on this job is scheduled for today
        const tasks = job.tasks?.nodes || [];
        const hasTaskToday = tasks.some(t => {
          const taskDate = (t.startDate || t.endDate || "").slice(0, 10);
          return taskDate === today;
        });
        if (hasTaskToday) {
          repData[rep.name].estimatesToShip++;
        }
      }
    }

    // Also check scheduled tasks for today's status-02 jobs
    for (const task of (scheduledResult?.organization?.tasks?.nodes || [])) {
      const taskDate = (task.startDate || task.endDate || "").slice(0, 10);
      if (taskDate !== today) continue;
      const jobCfvs = task.job?.customFieldValues?.nodes || [];
      const status = getCfv(jobCfvs, CF_STATUS_ID) || "";
      const salesRep = getCfv(jobCfvs, CF_SALES_REP_ID) || "";
      if (!status.startsWith("02")) continue;
      const rep = REPS.find(r => r.fullName === salesRep);
      if (!rep) continue;
      repData[rep.name].estimatesToShip++;
    }

    // 3. Compute speed metric from documents
    const allDocs = [
      ...(pendingDocs?.organization?.documents?.nodes || []),
      ...(approvedDocs?.organization?.documents?.nodes || [])
    ];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

    const seenDocJobs = new Set();
    for (const doc of allDocs) {
      const job = doc.job;
      if (!job?.id || seenDocJobs.has(job.id)) continue;
      seenDocJobs.add(job.id);

      const docDate = (doc.createdAt || "").slice(0, 10);
      if (docDate < sixMonthsAgoStr) continue; // Only last 6 months

      const cfvNodes = job.customFieldValues?.nodes || [];
      const salesRep = getCfv(cfvNodes, CF_SALES_REP_ID) || "";
      const rep = REPS.find(r => r.fullName === salesRep);
      if (!rep) continue;

      // Find first task scheduled date on this job
      const tasks = job.tasks?.nodes || [];
      const taskDates = tasks
        .map(t => t.startDate || t.endDate)
        .filter(d => d)
        .map(d => d.slice(0, 10))
        .sort();

      if (taskDates.length === 0) continue;
      const firstTaskDate = taskDates[0];

      // Speed = days from first task scheduled date to doc created date, excluding Sundays
      const speed = countDaysExSunday(firstTaskDate, docDate);
      if (speed !== null && speed > 0 && speed < 180) {
        repData[rep.name].speedSamples.push({
          days: speed,
          jobName: job.name || "?",
          taskDate: firstTaskDate,
          docDate: docDate
        });
      }
    }

    // Compute averages
    for (const rep of REPS) {
      const samples = repData[rep.name].speedSamples;
      if (samples.length > 0) {
        const sum = samples.reduce((a, b) => a + b.days, 0);
        repData[rep.name].speedAvg = Math.round((sum / samples.length) * 10) / 10;
        // Find personal best
        const best = samples.reduce((a, b) => a.days < b.days ? a : b);
        repData[rep.name].personalBest = {
          days: best.days,
          jobName: best.jobName,
          date: best.docDate
        };
      }
      repData[rep.name].sampleSize = samples.length;
      delete repData[rep.name].speedSamples; // Don't send raw data to client
    }

    // Sort by speed (fastest first), nulls last
    const leaderboard = Object.values(repData)
      .sort((a, b) => {
        if (a.speedAvg === null && b.speedAvg === null) return 0;
        if (a.speedAvg === null) return 1;
        if (b.speedAvg === null) return -1;
        return a.speedAvg - b.speedAvg;
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        leaderboard,
        computedAt: new Date().toISOString(),
        today,
        totalDocsAnalyzed: allDocs.length,
        totalTasksFetched: allTasks.length,
        totalJobsFetched: allJobNodes.length,
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message, stack: e.stack })
    };
  }
};
