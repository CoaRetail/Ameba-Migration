export type LeadSlackPayload = {
  leadId: string;
  company?: string;
  name: string;
  email: string;
  phone?: string;
  url: string;
  domainType: string;
  service?: string;
  plan: string;
  message: string;
};

/** Airtable 保存成功後に Slack へ通知（未設定・失敗時も呼び出し元の成功レスポンスは変えない） */
export async function notifyLeadSlack(p: LeadSlackPayload): Promise<void> {
  const hook = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!hook) return;

  const body = p.message.length > 1500 ? `${p.message.slice(0, 1500)}…` : p.message;
  const lines = [
    "*【Ameba Ownd LP】新規問い合わせ*",
    p.company ? `会社: ${p.company}` : undefined,
    `名前: ${p.name}`,
    `メール: ${p.email}`,
    p.phone ? `電話: ${p.phone}` : undefined,
    `サイト: ${p.url}`,
    `ドメイン: ${p.domainType}`,
    p.service ? `希望内容: ${p.service}` : undefined,
    `プラン: ${p.plan}`,
    `Lead ID: \`${p.leadId}\``,
    "",
    "*お問い合わせ内容*",
    body,
  ].filter((line): line is string => line !== undefined);

  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error("slack_notify_error", r.status);
  } catch {
    console.error("slack_notify_unreachable");
  }
}
