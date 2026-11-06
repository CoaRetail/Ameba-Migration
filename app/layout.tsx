import type { Metadata, Viewport } from "next";
import GoogleTagManager, { GoogleTagManagerNoScript } from "./GoogleTagManager";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ameba Ownd 緊急移行サービス｜2026年12月24日のサービス終了までに移行準備を",
  description:
    "Ameba Ownd のサービス終了に伴うホームページの移行を支援します。独自ドメインや既存コンテンツも含めてご相談ください。",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <GoogleTagManagerNoScript />
        {children}
        <GoogleTagManager />
      </body>
    </html>
  );
}
