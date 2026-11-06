import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

const GTAG_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
`;

/** Google Tag Manager + dataLayer / gtag  bootstrap */
export default function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="gtm-js" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
      <Script id="gtm-gtag-bootstrap" strategy="afterInteractive">
        {GTAG_BOOTSTRAP}
      </Script>
    </>
  );
}

export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
