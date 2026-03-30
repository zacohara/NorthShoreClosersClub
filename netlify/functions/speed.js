const JT_API = "https://api.jobtread.com/pave";
const JT_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG = "22NvNEMpKBmy";
const SB_URL = process.env.VITE_SUPABASE_URL || "https://wkrtbjvbjebhbcjwurhb.supabase.co";
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const CF_REP = "22Nx8AjZSNmw";
const CF_STATUS = "22NzE5gAPktJ";
const REP_NAMES = {"Les O'Hara":"Les","Luke Bergman":"Luke","Jace O'Hara":"Jace","Paul Boidanis":"Paul",
  "Carlos Celleri":"Carlos","Devin O'Hara":"Devin","BJ Tippmann":"BJ","Cortney Campbell":"Cortney"};
const REPS_MID = {"22Nwt8wGjTEx":"Les","22P92SdAQUQE":"Luke","22PTSGV5U7Rj":"Jace","22PGVz57tzke":"Paul",
  "22NxzADWDVVA":"Carlos","22NztygQhunB":"Devin","22PHDEMpwFKR":"BJ","22NxBXSxWBRq":"Cortney"};
const H = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"};

function countSpeed(a, b) {
  const s = new Date(a+"T00:00:00"), e = new Date(b+"T00:00:00");
  if (e < s) return 0;
  let d = 0, c = new Date(s);
  while (c <= e) { if (c.getDay() !== 0) d++; c.setDate(c.getDate()+1); }
  return d;
}

async function pave(q) {
  const r = await fetch(JT_API, { method:"POST",
    headers:{"Authorization":"Bearer "+JT_KEY,"Content-Type":"application/json"},
    body: JSON.stringify({organizationId:JT_ORG, query:{organization:{$:{id:JT_ORG},...q}}})
  });
  try { return (await r.json()).organization || {}; } catch { return {}; }
}

function getCFV(nodes, fid) {
  if (!nodes) return null;
  for (const c of nodes) {
    if (c?.customField?.id === fid) return c?.values?.[0] || c?.value || null;
  }
  return null;
}

async function readCache() {
  if (!SB_KEY) return null;
  try {
    const r = await fetch(SB_URL+"/rest/v1/speed_cache?id=eq.current&select=*",
      {headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY}});
    const rows = await r.json();
    if (rows?.[0]?.data) {
      const d = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return {...d, cachedAt: rows[0].computed_at, fromCache: true};
    }
  } catch {}
  return null;
}

async function writeCache(data) {
  if (!SB_KEY) return;
  try {
    await fetch(SB_URL+"/rest/v1/speed_cache?on_conflict=id", {method:"POST",
      headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},
      body: JSON.stringify({id:"current",data:JSON.stringify(data),computed_at:new Date().toISOString()})
    });
  } catch {}
}

async function paginateAll(queryFn, maxPages) {
  const all = [];
  let page = null;
  for (let i = 0; i < maxPages; i++) {
    const {nodes, nextPage} = await queryFn(page);
    all.push(...nodes);
    if (!nextPage || !nodes.length) break;
    page = nextPage;
  }
  return all;
}

async function computeFresh() {
  const today = new Date().toISOString().split("T")[0];
  const sixAgo = new Date(Date.now()-180*86400000).toISOString().split("T")[0];

  // 1. OVERDUE TO-DOS: paginate with completed=0, endDate < today
  const overdueTodos = await paginateAll(async (page) => {
    const q = {size:100, where:{and:[
      {"=":[{field:["isGroup"]},{value:false}]},
      {"=":[{field:["isToDo"]},{value:true}]},
      {"=":[{field:["completed"]},{value:0}]},
      {"<":[{field:["endDate"]},{value:today}]},
    ]}};
    if (page) q.page = page;
    const r = await pave({tasks:{$:q, nodes:{id:{},assignedMemberships:{nodes:{id:{}}}}, nextPage:{}}});
    return {nodes: r.tasks?.nodes||[], nextPage: r.tasks?.nextPage};
  }, 15);

  const repOverdue = {};
  for (const rep of Object.values(REPS_MID)) repOverdue[rep] = 0;
  for (const t of overdueTodos) {
    for (const a of (t.assignedMemberships?.nodes||[])) {
      const rep = REPS_MID[a.id];
      if (rep) repOverdue[rep]++;
    }
  }

  // 2. SPEED: paginate customerOrder docs (pending+approved), get nested job tasks
  const speedPts = new Map();
  for (const status of ["pending","approved"]) {
    const docs = await paginateAll(async (page) => {
      const q = {size:30, where:{and:[
        {"=":[{field:["type"]},{value:"customerOrder"}]},
        {"=":[{field:["status"]},{value:status}]},
      ]}};
      if (page) q.page = page;
      const r = await pave({documents:{$:q, nodes:{
        createdAt:{},job:{id:{},name:{},
          tasks:{nodes:{startDate:{},endDate:{}}},
          customFieldValues:{nodes:{value:{},customField:{id:{}}}}}
      }, nextPage:{}}});
      return {nodes: r.documents?.nodes||[], nextPage: r.documents?.nextPage};
    }, 20);

    for (const doc of docs) {
      const job = doc.job;
      if (!job?.id || speedPts.has(job.id)) continue;
      const dd = (doc.createdAt||"").slice(0,10);
      if (dd < sixAgo) continue;
      const rep = REP_NAMES[getCFV(job.customFieldValues?.nodes, CF_REP)];
      if (!rep) continue;
      const td = (job.tasks?.nodes||[]).map(t=>t.startDate||t.endDate).filter(Boolean).map(d=>d.slice(0,10)).sort();
      if (!td.length) continue;
      const sp = countSpeed(td[0], dd);
      if (sp > 0 && sp < 120) speedPts.set(job.id, {rep, speed:sp, job:job.name, date:dd});
    }
  }

  // 3. ESTIMATES TO SHIP: paginate open jobs, check status 03 + status 02 with task today
  const repToShip = {};
  for (const rep of Object.values(REP_NAMES)) repToShip[rep] = 0;
  const shipJobs = await paginateAll(async (page) => {
    const q = {size:30};
    if (page) q.page = page;
    const r = await pave({jobs:{$:q, nodes:{
      id:{},closedOn:{},
      tasks:{nodes:{startDate:{},endDate:{}}},
      customFieldValues:{nodes:{value:{},customField:{id:{}}}}
    }, nextPage:{}}});
    return {nodes: r.jobs?.nodes||[], nextPage: r.jobs?.nextPage};
  }, 60);

  for (const j of shipJobs) {
    if (j.closedOn) continue;
    const rep = REP_NAMES[getCFV(j.customFieldValues?.nodes, CF_REP)];
    if (!rep) continue;
    const st = getCFV(j.customFieldValues?.nodes, CF_STATUS) || "";
    if (st.startsWith("03")) repToShip[rep]++;
    else if (st.startsWith("02")) {
      if ((j.tasks?.nodes||[]).some(t=>(t.startDate||t.endDate||"").slice(0,10)===today)) repToShip[rep]++;
    }
  }

  // BUILD LEADERBOARD
  const reps = ["Les","Luke","Paul","Carlos","Jace","Devin","BJ","Cortney"];
  const leaderboard = reps.map(rep => {
    const pts = [...speedPts.values()].filter(s=>s.rep===rep);
    const avg = pts.length ? Math.round(pts.reduce((a,b)=>a+b.speed,0)/pts.length*10)/10 : null;
    const best = pts.length ? pts.reduce((a,b)=>a.speed<b.speed?a:b) : null;
    return {
      name: rep, speed: avg, samples: pts.length,
      overdue: repOverdue[rep]||0, toShip: repToShip[rep]||0,
      personalBest: best ? {days:best.speed, job:best.job, date:best.date} : null,
    };
  });
  leaderboard.sort((a,b) => {
    if (a.speed===null && b.speed===null) return 0;
    if (a.speed===null) return 1;
    if (b.speed===null) return -1;
    return a.speed - b.speed;
  });

  return {leaderboard, computedAt:new Date().toISOString(), speedPoints:speedPts.size, todosProcessed:overdueTodos.length, jobsScanned:shipJobs.length};
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return {statusCode:200, headers:H, body:""};

  if (event.httpMethod === "GET") {
    const cached = await readCache();
    if (cached?.leaderboard?.length) return {statusCode:200, headers:H, body:JSON.stringify(cached)};
    // No cache — compute fresh
    try {
      const fresh = await computeFresh();
      await writeCache(fresh);
      return {statusCode:200, headers:H, body:JSON.stringify(fresh)};
    } catch (e) {
      return {statusCode:500, headers:H, body:JSON.stringify({error:e.message})};
    }
  }

  // POST = force refresh
  try {
    const fresh = await computeFresh();
    await writeCache(fresh);
    return {statusCode:200, headers:H, body:JSON.stringify(fresh)};
  } catch (e) {
    return {statusCode:500, headers:H, body:JSON.stringify({error:e.message})};
  }
};
