import { SITE, getSiteUrl } from "@/lib/site";

const TERMS_TITLE = "Ameba Ownd Website Migration 利用規約";

export default function TermsStructuredData() {
  const base = getSiteUrl();
  const termsUrl = `${base}/terms`;

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${termsUrl}#webpage`,
      url: termsUrl,
      name: `${TERMS_TITLE}｜${SITE.legalName}`,
      description:
        "合同会社コア・リテールが提供するAmeba Ownd Website Migrationの利用条件を定める利用規約です。",
      isPartOf: { "@id": `${base}/#website` },
      inLanguage: "ja",
      about: { "@id": `${base}/#service` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${termsUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: base },
        { "@type": "ListItem", position: 2, name: TERMS_TITLE, item: termsUrl },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}