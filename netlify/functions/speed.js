const SB_URL = process.env.VITE_SUPABASE_URL || "https://wkrtbjvbjebhbcjwurhb.supabase.co";
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const H = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return {statusCode:200, headers:H, body:""};

  if (!SB_KEY) {
    return {statusCode:500, headers:H, body:JSON.stringify({error:"No Supabase key configured"})};
  }

  try {
    const r = await fetch(SB_URL + "/rest/v1/speed_cache?id=eq.current&select=*", {
      headers: {apikey: SB_KEY, Authorization: "Bearer " + SB_KEY}
    });
    const rows = await r.json();
    if (rows?.[0]?.data) {
      const d = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
      return {
        statusCode: 200,
        headers: H,
        body: JSON.stringify({...d, cachedAt: rows[0].computed_at, fromCache: true})
      };
    }
    return {statusCode:200, headers:H, body:JSON.stringify({leaderboard:[], companyAvg:null, computedAt:null})};
  } catch (e) {
    return {statusCode:500, headers:H, body:JSON.stringify({error:e.message})};
  }
};
