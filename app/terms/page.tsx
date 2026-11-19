import type { Metadata } from "next";
import Link from "next/link";
import { TERMS_ARTICLES, TERMS_EFFECTIVE_DATE } from "@/lib/terms-articles";
import { SITE } from "@/lib/site";

const TERMS_TITLE = "Ameba Ownd Website Migration 利用規約";
const TERMS_DESCRIPTION =
  "合同会社コア・リテールが提供するAmeba Ownd Website Migrationの利用条件を定める利用規約です。";

export const metadata: Metadata = {
  title: `${TERMS_TITLE}｜${SITE.legalName}`,
  description: TERMS_DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/terms",
    siteName: SITE.name,
    title: `${TERMS_TITLE}｜${SITE.legalName}`,
    description: TERMS_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${TERMS_TITLE}｜${SITE.legalName}`,
    description: TERMS_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="terms-page">
      <header className="terms-topbar">
        <div className="terms-topbar-inner">
          <Link href="/" className="terms-home-link">
            {SITE.name}
          </Link>
        </div>
      </header>

      <main className="terms-main">
        <article className="terms-article">
          <p className="terms-effective">施行日：{TERMS_EFFECTIVE_DATE}</p>
          <h1>{TERMS_TITLE}</h1>
          <p className="terms-subtitle">{SITE.legalName}</p>

          <div className="terms-intro">
            <p>
              本利用規約（以下「本規約」といいます。）は、{SITE.legalName}（以下「当社」といいます。）が提供する「Ameba
              Ownd Website Migration」（以下「本サービス」といいます。）の利用条件を定めるものです。
            </p>
            <p>
              本サービスを申し込む事業者（法人、個人事業主その他事業として本サービスを利用する者をいい、以下「利用者」といいます。）は、本規約の内容を確認し、同意のうえ本サービスを申し込むものとします。
            </p>
          </div>

          {TERMS_ARTICLES.map((article) => (
            <section key={article.title} className="terms-section">
              <h2>{article.title}</h2>
              {article.blocks.map((block, i) => {
                if (block.kind === "p") return <p key={i}>{block.text}</p>;
                if (block.kind === "ol")
                  return (
                    <ol key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  );
                return (
                  <ul key={i}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              })}
            </section>
          ))}

          <section className="terms-section terms-appendix">
            <h2>附則</h2>
            <p>
              {TERMS_EFFECTIVE_DATE} 制定・施行
              <br />
              {SITE.legalName}
            </p>
          </section>
        </article>
      </main>

      <footer className="terms-footer">
        <div className="terms-footer-inner">
          <p className="terms-footer-brand">{SITE.name}</p>
          <p className="terms-footer-legal">運営：{SITE.legalName}</p>
          <nav className="terms-footer-nav" aria-label="フッターメニュー">
            <Link href="/">トップ</Link>
            <Link href="/terms">利用規約</Link>
            <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer">
              プライバシーポリシー
            </a>
            <a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer">
              会社概要
            </a>
          </nav>
          <p className="terms-footer-copy">© {SITE.legalName}</p>
        </div>
      </footer>
    </div>
  );
}