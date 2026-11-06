/** GTM コンテナ ID（未設定時はタグ・イベント送信なし） */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (!GTM_ID || typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

/** 問い合わせフォーム送信成功（GA4 推奨イベント generate_lead） */
export function trackGenerateLead(plan: string) {
  trackEvent("generate_lead", {
    currency: "JPY",
    value: 0,
    lead_source: "ameba-ownd-lp",
    requested_plan: plan,
  });
}
