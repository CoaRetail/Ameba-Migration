import { FAQS } from "@/lib/faqs";
import { SITE, getSiteUrl } from "@/lib/site";

export default function StructuredData() {
  const url = getSiteUrl();

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "ja",
      publisher: { "@id": `${url}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: SITE.legalName,
      url: SITE.companyUrl,
      brand: { "@type": "Brand", name: SITE.name },
    },
    {
      "@type": "WebPage",
      "@id": `${url}/#webpage`,
      url,
      name: SITE.title,
      description: SITE.description,
      isPartOf: { "@id": `${url}/#website` },
      about: { "@id": `${url}/#service` },
      inLanguage: "ja",
    },
    {
      "@type": "Service",
      "@id": `${url}/#service`,
      name: SITE.name,
      description: SITE.description,
      provider: { "@id": `${url}/#organization` },
      areaServed: { "@type": "Country", name: "Japan" },
      serviceType: "Ameba Ownd ホームページ移行支援",
      offers: [
        { "@type": "Offer", name: "無料相談", price: "0", priceCurrency: "JPY" },
        { "@type": "Offer", name: "Standard", price: "150000", priceCurrency: "JPY" },
        { "@type": "Offer", name: "Premium", price: "300000", priceCurrency: "JPY" },
        { "@type": "Offer", name: "Premium＋ARI", price: "400000", priceCurrency: "JPY" },
      ],
      additionalProperty: [
        { "@type": "PropertyValue", name: "対象", value: "Ameba Ownd で作成した店舗・企業・個人事業のホームページ" },
        { "@type": "PropertyValue", name: "サービス終了", value: SITE.serviceEndIso },
        { "@type": "PropertyValue", name: "GEO・AI検索対策", value: "Premium＋ARI プランで ARI（Agent Readiness Index）導入可" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
