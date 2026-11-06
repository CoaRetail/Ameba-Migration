import { NextResponse } from "next/server";
import { validate, type LeadInput } from "@/lib/leads";
import { notifyLeadSlack } from "@/lib/notify-slack";

export const runtime = "nodejs";

const CONSENT_VERSION = "2026-11-draft"; // プライバシーポリシー確定後に更新
const MAX_BODY = 20_000;
const RATE_LIMIT = 5; // 回 / 10分 / IP（サーバーレスでは不完全。Cloudflare等のレート制限も併用）
const RATE_WINDOW = 10 * 60 * 1000;
const hits = new Map<string, { c: number; t: number }>();

const res = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });
const fail = (status: number, code: string, extra: Record<string, unknown> = {}) => res(status, { ok: false, code, ...extra });

function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  const list = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!origin) return false;
  if (list.length) return list.includes(origin);
  return process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin);
}

function rateLimited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > RATE_WINDOW) {
    hits.set(ip, { c: 1, t: now });
    if (hits.size > 5000) for (const [k, v] of hits) if (now - v.t > RATE_WINDOW) hits.delete(k);
    return false;
  }
  h.c += 1;
  return h.c > RATE_LIMIT;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const j = await r.json();
    return j.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!originAllowed(req)) return fail(403, "forbidden");
  if (!(req.headers.get("content-type") || "").includes("application/json")) return fail(415, "bad_request");

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) return fail(429, "rate_limited");

  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail(413, "bad_request");
  let b: any;
  try { b = JSON.parse(raw); } catch { return fail(400, "bad_request"); }
  if (!b || typeof b !== "object") return fail(400, "bad_request");

  // Honeypot：入力されていたら保存せず、成功したように返す
  if (typeof b.hp === "string" && b.hp.length > 0) return res(200, { ok: true });

  const input = b as Partial<LeadInput>;
  const errors = validate(input);
  if (Object.keys(errors).length) return fail(400, "validation", { errors });

  if (!(await verifyTurnstile(String(b.turnstileToken || ""), ip))) return fail(400, "turnstile");

  const { AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env;
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) return fail(500, "server");

  const t = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const fields: Record<string, unknown> = {
    "Lead ID": t(input.submissionId),
    "Company": t(input.company),
    "Contact Name": t(input.name),
    "Email": t(input.email),
    "Phone": t(input.phone),
    "Website URL": t(input.url),
    "Domain Type": t(input.domainType),
    "Requested Service": t(input.service),
    "Requested Plan": t(input.plan),
    "Message": t(input.message),
    "Source": "ameba-ownd-lp",
    "UTM Source": t(input.utm?.source)?.slice(0, 200),
    "UTM Medium": t(input.utm?.medium)?.slice(0, 200),
    "UTM Campaign": t(input.utm?.campaign)?.slice(0, 200),
    "Status": "New",
    "Consent Version": CONSENT_VERSION,
    "Consent Timestamp": new Date().toISOString(),
  };
  for (const k of Object.keys(fields)) if (fields[k] === undefined) delete fields[k];

  try {
    // Lead ID をキーにしたupsert：同じ送信IDの再送は新規作成されず、重複登録を防ぐ
    const r = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}`, "Content-Type": "application/json" },
      body: JSON.stringify({ performUpsert: { fieldsToMergeOn: ["Lead ID"] }, typecast: true, records: [{ fields }] }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error("airtable_error", r.status); // 個人情報は出力しない
      return fail(502, "server");
    }
    await notifyLeadSlack({
      leadId: String(fields["Lead ID"]),
      company: t(input.company),
      name: str(input.name),
      email: str(input.email),
      phone: t(input.phone),
      url: str(input.url),
      domainType: str(input.domainType),
      service: t(input.service),
      plan: str(input.plan),
      message: str(input.message),
    });
    return res(200, { ok: true });
  } catch {
    console.error("airtable_unreachable");
    return fail(502, "server");
  }
}
