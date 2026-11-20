import { FAQS } from "@/lib/faqs";
import { OG_IMAGE } from "@/lib/geo-facts";
import { SITE, getSiteUrl } from "@/lib/site";

export default function StructuredData() {
  const url = getSiteUrl();
  const imageUrl = `${url}${OG_IMAGE.path}`;

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
      knowsAbout: [
        "Ameba Ownd ホームページ移行",
        "GEO Search Protocol",
        "Agent Readiness Index",
        "AI検索最適化",
      ],
      sameAs: [SITE.companyUrl, SITE.geoServiceUrl],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        areaServed: "JP",
        availableLanguage: ["Japanese"],
        url,
      },
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
      dateModified: SITE.contentUpdatedIso,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        caption: OG_IMAGE.alt,
      },
      significantLink: [
        SITE.officialNoticeUrl,
        `${url}/terms`,
        `${url}/llms.txt`,
        SITE.geoServiceUrl,
      ],
    },
    {
      "@type": "Service",
      "@id": `${url}/#service`,
      name: SITE.name,
      description: SITE.description,
      url,
      termsOfService: `${url}/terms`,
      provider: { "@id": `${url}/#organization` },
      areaServed: { "@type": "Country", name: "Japan" },
      serviceType: "Ameba Ownd ホームページ移行支援",
      offers: [
        { "@type": "Offer", name: "無料相談", price: "0", priceCurrency: "JPY", url: `${url}/#consult` },
        { "@type": "Offer", name: "Standard", price: "150000", priceCurrency: "JPY" },
        { "@type": "Offer", name: "Premium", price: "300000", priceCurrency: "JPY" },
        { "@type": "Offer", name: "Premium＋ARI", price: "400000", priceCurrency: "JPY" },
      ],
      additionalProperty: [
        { "@type": "PropertyValue", name: "対象", value: "Ameba Ownd で作成した店舗・企業・個人事業のホームページ" },
        { "@type": "PropertyValue", name: "サービス終了予定", value: SITE.serviceEndDisplay },
        { "@type": "PropertyValue", name: "更新機能", value: "記事・ページの投稿・更新は停止したまま" },
        { "@type": "PropertyValue", name: "GEO・AI検索対策", value: "Premium＋ARI プランで ARI（Agent Readiness Index）導入可" },
        { "@type": "PropertyValue", name: "公式情報", value: SITE.officialNoticeUrl },
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
    {
      "@type": "BreadcrumbList",
      "@id": `${url}/#breadcrumb`,
      itemListElement: [{ "@type": "ListItem", position: 1, name: SITE.name, item: url }],
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