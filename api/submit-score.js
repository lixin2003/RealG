const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_SCORE_TABLE || "scores";
const PLAYER_ID_PATTERN = /^[A-Za-z0-9_]{2,20}$/;

function sendJson(response, statusCode, payload) {
  response.status(statusCode).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.end(JSON.stringify(payload));
}

function getSupabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
}

function parseBody(request) {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }

  return request.body && typeof request.body === "object" ? request.body : null;
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    sendJson(response, 500, { error: "Missing Supabase environment variables" });
    return;
  }

  const body = parseBody(request);
  if (!body) {
    sendJson(response, 400, { error: "Invalid JSON body" });
    return;
  }

  const playerId = typeof body.playerId === "string" ? body.playerId.trim() : "";
  const levelId = typeof body.levelId === "string" ? body.levelId.trim() : "";
  const clearTimeMs = Number.parseInt(String(body.clearTimeMs), 10);

  if (!PLAYER_ID_PATTERN.test(playerId)) {
    sendJson(response, 400, {
      error: "playerId must be 2-20 characters and contain only letters, numbers, or underscores"
    });
    return;
  }

  if (levelId !== "stage-2") {
    sendJson(response, 400, { error: "Only stage-2 scores can be submitted" });
    return;
  }

  if (!Number.isFinite(clearTimeMs) || clearTimeMs <= 0) {
    sendJson(response, 400, { error: "clearTimeMs must be a positive integer" });
    return;
  }

  const payload = {
    player_id: playerId,
    level_id: levelId,
    clear_time_ms: clearTimeMs
  };

  try {
    const upstreamResponse = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload)
    });

    if (!upstreamResponse.ok) {
      const details = await upstreamResponse.text();
      sendJson(response, 502, { error: "Failed to submit score", details });
      return;
    }

    const rows = await upstreamResponse.json();
    sendJson(response, 200, {
      success: true,
      score: Array.isArray(rows) ? rows[0] || null : rows
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "Unexpected submit error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
