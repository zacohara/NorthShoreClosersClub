const JT_API_KEY = "22TGiKuasNuBCh9DF36aQCWsfV6DQdDTwz";
const JT_ORG_ID = "22NvNEMpKBmy";

async function fetchTasks(isToDo) {
  const resp = await fetch("https://api.jobtread.com/pave", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${JT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      organizationId: JT_ORG_ID,
      query: {
        organization: {
          $: { id: JT_ORG_ID },
          tasks: {
            $: {
              where: {
                and: [
                  { "=": [{ field: ["isGroup"] }, { value: false }] },
                  { "<": [{ field: ["progress"] }, { value: 1 }] },
                  { "=": [{ field: ["isToDo"] }, { value: isToDo }] }
                ]
              }
            },
            nodes: {
              id: {},
              name: {},
              isToDo: {},
              progress: {},
              endDate: {},
              assignedMemberships: { nodes: { id: {} } },
              job: { name: {}, number: {} }
            }
          }
        }
      }
    })
  });

  const text = await resp.text();
  try {
    const data = JSON.parse(text);
    return data?.organization?.tasks?.nodes || [];
  } catch (e) {
    console.error("PAVE parse error:", text.slice(0, 200));
    return [];
  }
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "POST only" }) };

  try {
    const { membershipId } = JSON.parse(event.body);
    if (!membershipId) return { statusCode: 400, headers, body: JSON.stringify({ error: "membershipId required" }) };

    const [todos, scheduled] = await Promise.all([
      fetchTasks(true),
      fetchTasks(false)
    ]);

    const allTasks = [...todos, ...scheduled];

    const myTasks = allTasks.filter(t => {
      const assignees = t.assignedMemberships?.nodes || [];
      return assignees.some(a => a.id === membershipId);
    });

    const formatted = myTasks.map(t => ({
      id: t.id,
      name: t.name,
      isToDo: t.isToDo,
      progress: t.progress,
      endDate: t.endDate,
      jobName: t.job?.name || null,
      jobNumber: t.job?.number || null
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        tasks: formatted,
        totalFetched: allTasks.length,
        mine: formatted.length
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message })
    };
  }
};
