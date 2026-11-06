import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/** GA4 gtag.js（NEXT_PUBLIC_GA_MEASUREMENT_ID があるときのみ出力） */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
`}
      </Script>
    </>
  );
}
