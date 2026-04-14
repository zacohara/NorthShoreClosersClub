// This is a Netlify BACKGROUND function (15-min timeout on Pro)
// Triggered by HTTP POST or by pg_cron via Supabase
const JT_API = "https://api.jobtread.com/pave";
const JT_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG = "22NvNEMpKBmy";
const SB_URL = process.env.VITE_SUPABASE_URL || "https://wkrtbjvbjebhbcjwurhb.supabase.co";
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const CF_REP = "22Nx8AjZSNmw";
const CF_STATUS = "22NzE5gAPktJ";

const REPS = [
  {name:"Les",jt:"Les O'Hara",mid:"22Nwt8wGjTEx"},
  {name:"Luke",jt:"Luke Bergman",mid:"22P92SdAQUQE"},
  {name:"Jace",jt:"Jace O'Hara",mid:"22PTSGV5U7Rj"},
  {name:"Paul",jt:"Paul Boidanis",mid:"22PGVz57tzke"},
  {name:"Carlos",jt:"Carlos Celleri",mid:"22NxzADWDVVA"},
  {name:"Devin",jt:"Devin O'Hara",mid:"22NztygQhunB"},
  {name:"BJ",jt:"BJ Tippmann",mid:"22PHDEMpwFKR"},
  {name:"Cortney",jt:"Cortney Campbell",mid:"22NxBXSxWBRq"},
];
const REP_NAMES = Object.fromEntries(REPS.map(r=>[r.jt,r.name]));
const REPS_MID = Object.fromEntries(REPS.map(r=>[r.mid,r.name]));
const NO_CORRECTION = new Set(["BJ","Carlos"]);

function countSpeed(a,b){
  const s=new Date(a+"T00:00:00"),e=new Date(b+"T00:00:00");
  if(e<s)return 0;
  let d=0,c=new Date(s);
  while(c<=e){if(c.getDay()!==0)d++;c.setDate(c.getDate()+1);}
  return d;
}

async function pave(q){
  const r=await fetch(JT_API,{method:"POST",
    headers:{"Authorization":"Bearer "+JT_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({organizationId:JT_ORG,query:{organization:{$:{id:JT_ORG},...q}}})});
  try{return(await r.json()).organization||{};}catch{return{};}
}

function getCFV(nodes,fid){
  if(!nodes)return null;
  for(const c of nodes)if(c?.customField?.id===fid)return c?.values?.[0]||c?.value||null;
  return null;
}

exports.handler = async (event) => {
  console.log("Speed refresh started at", new Date().toISOString());

  const today = new Date().toISOString().split("T")[0];
  const threeAgo = new Date(Date.now()-90*86400000).toISOString().split("T")[0];
  const twelveAgo = new Date(Date.now()-365*86400000).toISOString().split("T")[0];

  // Paginate ALL jobs
  const allJobs = new Map();
  let pg = null;
  for(let i=0;i<230;i++){
    const q={size:15};if(pg)q.page=pg;
    try{
      const r=await pave({jobs:{$:q,nodes:{
        id:{},name:{},closedOn:{},
        tasks:{nodes:{startDate:{},endDate:{},isToDo:{}}},
        documents:{nodes:{type:{},status:{},createdAt:{},issueDate:{}}},
        customFieldValues:{nodes:{value:{},customField:{id:{}}}}
      },nextPage:{}}});
      const nodes=r.jobs?.nodes||[];const np=r.jobs?.nextPage;
      for(const j of nodes)if(j.id)allJobs.set(j.id,j);
      if(!np||!nodes.length)break;pg=np;
    }catch{await new Promise(r=>setTimeout(r,1000));continue;}
  }
  console.log(`Scanned ${allJobs.size} jobs`);

  // Speed (3-month rolling)
  const speed3={},speed12={};
  for(const rn of REPS.map(r=>r.name)){speed3[rn]=[];speed12[rn]=[];}
  for(const[,j]of allJobs){
    const rep=REP_NAMES[getCFV(j.customFieldValues?.nodes,CF_REP)];if(!rep)continue;
    const sched=(j.tasks?.nodes||[]).filter(t=>!t.isToDo);
    const td=sched.map(t=>t.startDate||t.endDate).filter(Boolean).map(d=>d.slice(0,10)).sort();
    if(!td.length)continue;
    const eDocs=(j.documents?.nodes||[]).filter(d=>d.type==="customerOrder"&&(d.status==="pending"||d.status==="approved"));
    if(eDocs.length){
      const ed=eDocs.map(d=>(d.issueDate||(d.createdAt||"").slice(0,10))).filter(Boolean).sort();
      if(ed.length&&td[0]<=ed[0]){
        const sp=countSpeed(td[0],ed[0]);
        if(sp>0&&sp<120){
          const pt={speed:sp,job:j.name||"",date:ed[0]};
          if(ed[0]>=threeAgo)speed3[rep].push(pt);
          if(ed[0]>=twelveAgo)speed12[rep].push({...pt,live:false});
        }
      }
    }else if(!j.closedOn&&td[0]>=threeAgo){
      const sp=countSpeed(td[0],today);
      if(sp>0)speed3[rep].push({speed:sp,job:j.name||"",date:today,live:true});
    }
  }

  // Overdue to-dos
  const repOverdue={};for(const rn of REPS.map(r=>r.name))repOverdue[rn]=0;
  pg=null;
  for(let i=0;i<30;i++){
    const q={size:100,where:{and:[
      {"=":[{field:["isGroup"]},{value:false}]},
      {"=":[{field:["isToDo"]},{value:true}]},
      {"=":[{field:["completed"]},{value:0}]},
      {"<":[{field:["endDate"]},{value:today}]},
    ]}};if(pg)q.page=pg;
    const r=await pave({tasks:{$:q,nodes:{id:{},assignedMemberships:{nodes:{id:{}}}},nextPage:{}}});
    for(const t of(r.tasks?.nodes||[]))
      for(const a of(t.assignedMemberships?.nodes||[])){
        const rp=REPS_MID[a.id];if(rp)repOverdue[rp]++;
      }
    const np=r.tasks?.nextPage;if(!np||!(r.tasks?.nodes||[]).length)break;pg=np;
  }

  // To-ship = "Met" status
  const repToShip={};for(const rn of REPS.map(r=>r.name))repToShip[rn]=0;
  for(const[,j]of allJobs){
    if(j.closedOn)continue;
    const st=getCFV(j.customFieldValues?.nodes,CF_STATUS)||"";
    if(st.toLowerCase()!=="met")continue;
    const rep=REP_NAMES[getCFV(j.customFieldValues?.nodes,CF_REP)];
    if(rep)repToShip[rep]++;
  }

  // Personal best
  function computePB(pts,corr){
    const comp=pts.filter(p=>!p.live).sort((a,b)=>a.date.localeCompare(b.date));
    if(comp.length<5)return null;
    let ba=null,bw=null;
    for(let i=0;i<=comp.length-5;i++){
      const w=comp.slice(i,i+5);
      const avg=Math.round(w.reduce((s,p)=>s+p.speed,0)/5*corr*10)/10;
      if(ba===null||avg<ba){ba=avg;bw=w;}
    }
    return bw?{avg:ba,startDate:bw[0].date,endDate:bw[4].date}:null;
  }

  // Build leaderboard
  const lb=[];const allAvgs=[];
  for(const ri of REPS){
    const rn=ri.name;
    const pts=speed3[rn]||[];const pts12=speed12[rn]||[];
    const comp=pts.filter(p=>!p.live),live=pts.filter(p=>p.live);
    const rawAvg=pts.length?Math.round(pts.reduce((s,p)=>s+p.speed,0)/pts.length*10)/10:null;
    const corr=NO_CORRECTION.has(rn)?1.0:0.8;
    let avg=rawAvg?Math.round(rawAvg*corr*10)/10:null;
    const pb=computePB(pts12,corr);
    if(avg!==null)allAvgs.push(avg);
    lb.push({name:rn,speed:avg,samples:comp.length,liveSamples:live.length,
      overdue:repOverdue[rn]||0,toShip:repToShip[rn]||0,personalBest:pb});
  }
  // Override Les
  for(const r of lb)if(r.name==="Les")r.speed=5.5;
  lb.sort((a,b)=>{
    if(a.speed===null&&b.speed===null)return 0;
    if(a.speed===null)return 1;if(b.speed===null)return -1;
    return a.speed-b.speed;
  });
  const companyAvg=allAvgs.length?Math.round(allAvgs.reduce((s,v)=>s+v,0)/allAvgs.length*10)/10:null;

  // Cache to Supabase
  const cache={leaderboard:lb,companyAvg,computedAt:new Date().toISOString(),
    jobsScanned:allJobs.size,speedPoints:Object.values(speed3).reduce((s,v)=>s+v.length,0)};
  if(SB_KEY){
    await fetch(SB_URL+"/rest/v1/speed_cache?on_conflict=id",{method:"POST",
      headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,
        "Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},
      body:JSON.stringify({id:"current",data:JSON.stringify(cache),computed_at:cache.computedAt})});
  }

  console.log("Speed refresh complete:", JSON.stringify({companyAvg,jobs:allJobs.size,pts:cache.speedPoints}));
  for(const r of lb)console.log(`  ${r.name}: ${r.speed}d | overdue:${r.overdue} | ship:${r.toShip}`);

  return {statusCode:200,body:JSON.stringify(cache)};
};
