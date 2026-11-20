import type { Metadata, Viewport } from "next";
import GoogleTagManager, { GoogleTagManagerNoScript } from "./GoogleTagManager";
import { OG_IMAGE } from "@/lib/geo-facts";
import { SITE, getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const ogImages = [
  {
    url: OG_IMAGE.path,
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: OG_IMAGE.alt,
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Ameba Ownd",
    "アメーバオウンド",
    "Ameba Ownd 移行",
    "サービス終了",
    "2027年3月31日",
    "ホームページ移行",
    "エクスポート",
    "WordPress 移行",
    "Studio.Design",
    "独自ドメイン",
    "合同会社コア・リテール",
    "Coa Retail",
    "ARI",
    "Agent Readiness Index",
    "AI検索",
    "GEO",
    "AI SEO",
  ],
  authors: [{ name: SITE.legalName, url: SITE.companyUrl }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [OG_IMAGE.path],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "business",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary (llms.txt)" />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        {children}
        <GoogleTagManager />
      </body>
    </html>
  );
}
