const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_SCORE_TABLE || "scores";

function sendJson(response, statusCode, payload) {
  response.status(statusCode).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.end(JSON.stringify(payload));
}

function getSupabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };
}

function formatRows(rows) {
  const bestByPlayer = new Map();

  rows.forEach((row) => {
    const currentBest = bestByPlayer.get(row.player_id);
    if (!currentBest || row.clear_time_ms < currentBest.clear_time_ms) {
      bestByPlayer.set(row.player_id, row);
    }
  });

  return [...bestByPlayer.values()]
    .sort((first, second) => {
      if (first.clear_time_ms !== second.clear_time_ms) {
        return first.clear_time_ms - second.clear_time_ms;
      }
      return new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
    })
    .map((row, index) => ({
      rank: index + 1,
      playerId: row.player_id,
      levelId: row.level_id,
      clearTimeMs: row.clear_time_ms,
      createdAt: row.created_at
    }));
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    sendJson(response, 500, { error: "Missing Supabase environment variables" });
    return;
  }

  const levelId = typeof request.query.levelId === "string" && request.query.levelId.trim()
    ? request.query.levelId.trim()
    : "stage-2";
  const limitValue = Number.parseInt(String(request.query.limit || "20"), 10);
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 100) : 20;

  const url = new URL(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`);
  url.searchParams.set("select", "player_id,level_id,clear_time_ms,created_at");
  url.searchParams.set("level_id", `eq.${levelId}`);
  url.searchParams.set("order", "clear_time_ms.asc,created_at.asc");
  url.searchParams.set("limit", String(Math.max(limit * 3, 50)));

  try {
    const upstreamResponse = await fetch(url, {
      headers: getSupabaseHeaders()
    });

    if (!upstreamResponse.ok) {
      const details = await upstreamResponse.text();
      sendJson(response, 502, { error: "Failed to load leaderboard", details });
      return;
    }

    const rows = await upstreamResponse.json();
    const leaderboard = formatRows(Array.isArray(rows) ? rows : []).slice(0, limit);
    sendJson(response, 200, { leaderboard });
  } catch (error) {
    sendJson(response, 500, {
      error: "Unexpected leaderboard error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
