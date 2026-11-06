export const DOMAIN_TYPES = ["amebaownd.com", "独自ドメイン", "わからない"] as const;
export const SERVICES = ["データ保全", "ホームページ移行", "独自ドメイン維持", "リニューアル", "相談して決めたい"] as const;
export const PLANS = ["無料相談", "Standard", "Premium", "Premium＋ARI", "未定・相談したい"] as const;

export type LeadInput = {
  company?: string;
  name: string;
  email: string;
  phone?: string;
  url: string;
  domainType: string;
  service?: string;
  plan: string;
  message: string;
  consent: boolean;
  submissionId: string;
  utm?: { source?: string; medium?: string; campaign?: string };
};

export type FieldKey = "company" | "name" | "email" | "phone" | "url" | "domainType" | "service" | "plan" | "message" | "consent" | "submissionId";
export type Errors = Partial<Record<FieldKey, string>>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** クライアントとサーバーで共通利用する入力検証。サーバー側の検証が正です。 */
export function validate(i: Partial<LeadInput>): Errors {
  const e: Errors = {};
  const name = str(i.name), email = str(i.email), phone = str(i.phone), url = str(i.url);
  const company = str(i.company), message = str(i.message);
  if (!name) e.name = "お名前を入力してください。";
  else if (name.length > 100) e.name = "100文字以内で入力してください。";
  if (company.length > 100) e.company = "100文字以内で入力してください。";
  if (!email) e.email = "メールアドレスを入力してください。";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "メールアドレスの形式が正しくありません。";
  if (phone && !/^[0-9+\-() ]{8,20}$/.test(phone)) e.phone = "電話番号の形式が正しくありません。";
  if (!url) e.url = "現在のホームページURLを入力してください。";
  else {
    let ok = false;
    try {
      const u = new URL(url);
      ok = (u.protocol === "http:" || u.protocol === "https:") && url.length <= 2048;
    } catch {}
    if (!ok) e.url = "https:// から始まるURLを入力してください。";
  }
  if (!(DOMAIN_TYPES as readonly string[]).includes(str(i.domainType))) e.domainType = "選択してください。";
  if (str(i.service) && !(SERVICES as readonly string[]).includes(str(i.service))) e.service = "選択肢から選んでください。";
  if (!(PLANS as readonly string[]).includes(str(i.plan))) e.plan = "選択肢から選んでください。";
  if (!message) e.message = "お問い合わせ内容を入力してください。";
  else if (message.length > 2000) e.message = "2000文字以内で入力してください。";
  if (i.consent !== true) e.consent = "個人情報の取り扱いへの同意が必要です。";
  if (!/^[0-9a-f-]{36}$/i.test(str(i.submissionId))) e.submissionId = "invalid";
  return e;
}
