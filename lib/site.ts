/** 本番カスタムドメイン（canonical / sitemap / JSON-LD の既定値） */
export const PRODUCTION_SITE_URL = "https://migration.coaretail.com";

/** 本番 URL（末尾スラッシュなし）。未設定時は Vercel production → 本番ドメイン → preview URL → localhost */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Ameba Ownd 移行サービス",
  legalName: "合同会社コア・リテール",
  title: "Ameba Ownd 移行サービス｜2027年3月31日のサービス終了に向けたWebサイト移行",
  description:
    "Ameba Owndは2027年3月31日にサービス終了予定。記事・ページの更新機能が停止しているAmeba Owndサイトを、WordPress・Studio.Design等の新しい環境へ移行支援。独自ドメイン・コンテンツ・画像・SEOを考慮して対応。合同会社コア・リテールが運営。",
  locale: "ja_JP",
  companyUrl: "https://www.coaretail.com",
  geoServiceUrl: "https://www.coaretail.com/geo",
  privacyUrl: "https://www.coaretail.com/lp_privacy",
  serviceEndIso: "2027-03-31T11:00:00+09:00",
  serviceEndDisplay: "2027年3月31日 11:00頃",
  officialNoticeUrl: "https://blog.amebaownd.com/posts/59351297/",
  officialNoticeLegacyUrl: "https://blog.amebaownd.com/posts/59351287/",
} as const;