/**
 * README どおりのフィールドを Airtable テーブルに追加する。
 * PAT に schema.bases:read と schema.bases:write が必要。
 *
 *   node scripts/setup-airtable-fields.mjs
 *   node scripts/setup-airtable-fields.mjs --create-table   # 新規テーブル AmebaOwnd_Leads を作成
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const env = {};
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) throw new Error(".env.local がありません");
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const STATUS = ["New", "Contacted", "Qualified", "Quoted", "Won", "Lost"];
const DOMAIN_TYPES = ["amebaownd.com", "独自ドメイン", "わからない"];
const SERVICES = ["データ保全", "ホームページ移行", "独自ドメイン維持", "リニューアル", "相談して決めたい"];
const PLANS = ["無料相談", "Standard", "Premium", "Premium＋ARI", "未定・相談したい"];

function selectChoices(names) {
  return { choices: names.map((name) => ({ name })) };
}

/** README + route.ts と一致するフィールド定義 */
export const LEAD_FIELDS = [
  { name: "Lead ID", type: "singleLineText" },
  { name: "Company", type: "singleLineText" },
  { name: "Contact Name", type: "singleLineText" },
  { name: "Email", type: "email" },
  { name: "Phone", type: "phoneNumber" },
  { name: "Website URL", type: "url" },
  { name: "Message", type: "multilineText" },
  { name: "Domain Type", type: "singleSelect", options: selectChoices(DOMAIN_TYPES) },
  { name: "Requested Service", type: "singleSelect", options: selectChoices(SERVICES) },
  { name: "Requested Plan", type: "singleSelect", options: selectChoices(PLANS) },
  { name: "Status", type: "singleSelect", options: selectChoices(STATUS) },
  { name: "Source", type: "singleLineText" },
  { name: "UTM Source", type: "singleLineText" },
  { name: "UTM Medium", type: "singleLineText" },
  { name: "UTM Campaign", type: "singleLineText" },
  { name: "Consent Version", type: "singleLineText" },
  {
    name: "Consent Timestamp",
    type: "dateTime",
    options: {
      dateFormat: { name: "iso" },
      timeFormat: { name: "24hour" },
      timeZone: "Asia/Tokyo",
    },
  },
  {
    name: "Created At",
    type: "createdTime",
    options: {
      result: {
        type: "dateTime",
        options: {
          dateFormat: { name: "local" },
          timeFormat: { name: "24hour" },
          timeZone: "Asia/Tokyo",
        },
      },
    },
  },
];

async function api(pat, url, init = {}) {
  const r = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { status: r.status, body };
}

async function main() {
  const createTable = process.argv.includes("--create-table");
  const { AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = loadEnv();
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    console.error("AIRTABLE_PAT と AIRTABLE_BASE_ID を .env.local に設定してください");
    process.exit(1);
  }

  if (createTable) {
    const fieldsForCreate = LEAD_FIELDS.filter((f) => f.type !== "createdTime");
    const { status, body } = await api(AIRTABLE_PAT, `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
      method: "POST",
      body: JSON.stringify({
        name: "AmebaOwnd_Leads",
        description: "Ameba Ownd 緊急移行 LP 問い合わせ",
        fields: fieldsForCreate,
      }),
    });
    if (status !== 200) {
      console.error("テーブル作成失敗 HTTP", status);
      console.error(body.error?.message || JSON.stringify(body));
      console.error("\nPAT に schema.bases:read / schema.bases:write があるか確認してください。");
      console.error("権限がない場合は airtable/SETUP.md の CSV インポート手順を使ってください。");
      process.exit(1);
    }
    const tableId = body.id;
    const createdAtField = LEAD_FIELDS.find((f) => f.type === "createdTime");
    if (createdAtField) {
      const { status: st, body: b } = await api(
        AIRTABLE_PAT,
        `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${tableId}/fields`,
        { method: "POST", body: JSON.stringify({ name: createdAtField.name, type: "createdTime" }) }
      );
      if (st !== 200) {
        console.error("Created At フィールド追加失敗 HTTP", st, b.error?.message || JSON.stringify(b));
        console.error("テーブルは作成済みです。Table ID:", tableId);
        process.exit(1);
      }
      console.log("added: Created At");
    }
    console.log("OK: テーブル AmebaOwnd_Leads を作成しました");
    console.log("Table ID:", tableId);
    console.log("\n.env.local の AIRTABLE_TABLE_ID を次の値に更新してください:");
    console.log("AIRTABLE_TABLE_ID=" + tableId);
    return;
  }

  if (!AIRTABLE_TABLE_ID) {
    console.error("AIRTABLE_TABLE_ID が未設定です");
    process.exit(1);
  }

  const { status, body } = await api(
    AIRTABLE_PAT,
    `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`
  );
  if (status !== 200) {
    console.error("Meta API HTTP", status, body.error?.message || body);
    console.error("\nPAT に schema.bases:read / schema.bases:write を追加するか、airtable/SETUP.md を参照してください。");
    process.exit(1);
  }

  const table = body.tables?.find((t) => t.id === AIRTABLE_TABLE_ID);
  if (!table) {
    console.error("TABLE_ID が Base 内に見つかりません:", AIRTABLE_TABLE_ID);
    process.exit(1);
  }

  const existing = new Set((table.fields || []).map((f) => f.name));
  console.log("Table:", table.name, table.id);
  console.log("Existing:", [...existing].join(", ") || "(none)");

  let added = 0;
  for (const field of LEAD_FIELDS) {
    if (existing.has(field.name)) {
      console.log("skip (exists):", field.name);
      continue;
    }
    const { status: st, body: b } = await api(
      AIRTABLE_PAT,
      `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${AIRTABLE_TABLE_ID}/fields`,
      {
        method: "POST",
        body: JSON.stringify(field.type === "createdTime" ? { name: field.name, type: "createdTime" } : field),
      }
    );
    if (st !== 200) {
      console.error("FAIL:", field.name, "HTTP", st, b.error?.message || JSON.stringify(b));
      process.exit(1);
    }
    console.log("added:", field.name);
    added++;
  }

  console.log("\nDone. Added", added, "field(s).");
  console.log("Lead ID を Primary フィールドにし、重複不可にすることを推奨します（Airtable UI）。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
