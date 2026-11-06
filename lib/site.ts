/** 本番 URL（末尾スラッシュなし）。未設定時は Vercel URL → localhost */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Ameba Ownd 緊急移行サービス",
  legalName: "合同会社コア・リテール",
  title: "Ameba Ownd 緊急移行サービス｜2026年12月24日のサービス終了までに移行準備を",
  description:
    "Ameba Ownd の2026年12月24日サービス終了に伴うホームページ移行を支援。独自ドメイン・既存コンテンツの保全、Standard/Premium プラン、Premium＋ARI（AI検索対策）まで。合同会社コア・リテールが運営。",
  locale: "ja_JP",
  companyUrl: "https://www.coaretail.com",
  geoServiceUrl: "https://www.coaretail.com/geo",
  privacyUrl: "https://www.coaretail.com/lp_privacy",
  serviceEndIso: "2026-12-24T11:00:00+09:00",
  officialNoticeUrl: "https://blog.amebaownd.com/posts/59351287/",
} as const;
