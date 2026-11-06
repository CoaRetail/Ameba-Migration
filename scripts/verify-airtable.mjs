/** 読み取り + 本番と同じ upsert の接続テスト */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv();
const { AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = env;

if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
  console.error("Missing AIRTABLE_* in .env.local");
  process.exit(1);
}

const testId = `verify-${Date.now()}`;
const fields = {
  "Lead ID": testId,
  "Contact Name": "接続テスト",
  Email: "verify@example.com",
  "Website URL": "https://example.com",
  "Domain Type": "わからない",
  "Requested Plan": "未定・相談したい",
  Message: "verify-airtable.mjs によるテスト。削除可。",
  Status: "New",
  Source: "ameba-ownd-lp",
  "Consent Version": "2026-11-draft",
  "Consent Timestamp": new Date().toISOString(),
};

const readUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?maxRecords=1`;
const r1 = await fetch(readUrl, { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` } });
console.log("Read HTTP:", r1.status);
if (!r1.ok) {
  console.error(await r1.text());
  process.exit(1);
}

const patchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
const r2 = await fetch(patchUrl, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${AIRTABLE_PAT}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    performUpsert: { fieldsToMergeOn: ["Lead ID"] },
    typecast: true,
    records: [{ fields }],
  }),
});
const j2 = await r2.json();
console.log("Write HTTP:", r2.status);
if (!r2.ok) {
  console.error(j2.error?.type, "-", j2.error?.message);
  process.exit(1);
}
console.log("OK: upsert succeeded. Lead ID:", testId, "record:", j2.records?.[0]?.id);
