import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const adminEmail = "klaus.digital.safe@gmail.com";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const allowedOrigin = "https://findoryshop-arbeit.github.io";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
  if (origin === allowedOrigin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function requireAdmin(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return null;
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user?.email || !user.email_confirmed_at) return null;
  return user.email.toLowerCase() === adminEmail ? user : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "method_not_allowed" }, 405);

  const user = await requireAdmin(request);
  if (!user) return json(request, { error: "admin_access_required" }, 403);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(request, { error: "invalid_json" }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const action = cleanText(payload.action, 40);

  if (action === "review_list") {
    const { data, error } = await adminClient
      .from("review_notes")
      .select("id,page_path,element_label,anchor,message,status,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return json(request, { error: "temporary_backend_error" }, 503);
    return json(request, { rows: data ?? [] });
  }

  if (action === "review_save") {
    const pagePath = cleanText(payload.pagePath, 500);
    const elementLabel = cleanText(payload.elementLabel, 220);
    const message = cleanText(payload.message, 3000);
    const anchor = payload.anchor && typeof payload.anchor === "object" && !Array.isArray(payload.anchor) ? payload.anchor : {};
    if (!pagePath || !elementLabel || message.length < 3) {
      return json(request, { error: "invalid_review_note" }, 400);
    }
    const { data, error } = await adminClient.from("review_notes").insert({
      page_path: pagePath,
      element_label: elementLabel,
      anchor,
      message,
      status: "open",
      author_id: user.id
    }).select("id,page_path,element_label,message,status,created_at").single();
    if (error) return json(request, { error: "temporary_backend_error" }, 503);
    return json(request, { row: data }, 201);
  }

  if (action === "review_status") {
    const id = cleanText(payload.id, 80);
    const status = cleanText(payload.status, 30);
    if (!/^[0-9a-f-]{36}$/i.test(id) || !["open", "in_progress", "resolved", "archived"].includes(status)) {
      return json(request, { error: "invalid_status_update" }, 400);
    }
    const { data, error } = await adminClient.from("review_notes")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id,status,updated_at")
      .single();
    if (error) return json(request, { error: "temporary_backend_error" }, 503);
    return json(request, { row: data });
  }

  return json(request, { error: "unknown_action" }, 400);
});
