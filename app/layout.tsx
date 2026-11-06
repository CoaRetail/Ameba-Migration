import type { Metadata, Viewport } from "next";
import GoogleTagManager, { GoogleTagManagerNoScript } from "./GoogleTagManager";
import StructuredData from "./StructuredData";
import { SITE, getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "Ameba Ownd",
    "アメーバオウンド",
    "サービス終了",
    "ホームページ移行",
    "独自ドメイン",
    "合同会社コア・リテール",
    "ARI",
    "AI検索",
    "GEO",
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
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
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
        <StructuredData />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        {children}
        <GoogleTagManager />
      </body>
    </html>
  );
}
