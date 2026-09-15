import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const allowedOrigin = Deno.env.get("FINDORY_ALLOWED_ORIGIN") ?? "";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (allowedOrigin && origin === allowedOrigin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(request: Request, body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "method_not_allowed" }, 405);

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return json(request, { error: "authentication_required" }, 401);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json(request, { error: "authentication_required" }, 401);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(request, { error: "invalid_json" }, 400);
  }

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return json(request, { accepted: true }, 202);
  }

  const postSlug = typeof payload.postSlug === "string" ? payload.postSlug.trim() : "";
  const authorName = typeof payload.authorName === "string" ? payload.authorName.trim() : "";
  const body = typeof payload.body === "string" ? payload.body.trim() : "";

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(postSlug) || postSlug.length > 160) {
    return json(request, { error: "invalid_post" }, 400);
  }
  if (authorName.length < 1 || authorName.length > 80) {
    return json(request, { error: "invalid_author_name" }, 400);
  }
  if (body.length < 3 || body.length > 4000) {
    return json(request, { error: "invalid_comment" }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error: rateError } = await adminClient
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id)
    .gte("created_at", since)
    .in("status", ["pending", "approved"]);

  if (rateError) return json(request, { error: "temporary_backend_error" }, 503);
  if ((count ?? 0) >= 5) return json(request, { error: "rate_limited" }, 429);

  const { error: insertError } = await adminClient.from("comments").insert({
    post_slug: postSlug,
    author_id: user.id,
    author_name: authorName,
    body,
    status: "pending"
  });

  if (insertError) return json(request, { error: "temporary_backend_error" }, 503);
  return json(request, { accepted: true, status: "pending" }, 202);
});
