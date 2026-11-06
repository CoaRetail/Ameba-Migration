/** GA4 測定 ID（未設定時は計測しない） */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
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
