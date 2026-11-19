"use client";
import { Fragment, useEffect, useState } from "react";
import { FAQS } from "@/lib/faqs";
import { SITE } from "@/lib/site";
import ContactForm from "./ContactForm";
import StructuredData from "./StructuredData";

const PLACEHOLDER = "—";

function css(str: string): React.CSSProperties {
  const o: Record<string, string> = {};
  str.split(";").forEach((d) => {
    const i = d.indexOf(":");
    if (i < 0) return;
    const k = d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (k) o[k] = d.slice(i + 1).trim();
  });
  return o as React.CSSProperties;
}

export default function Home() {
  const [now, setNow] = useState<number | null>(null);
  const [plan, setPlan] = useState("未定・相談したい");
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const mounted = now !== null;
    const end = Date.parse(SITE.serviceEndIso);
    const left = mounted ? Math.max(0, end - now!) : null;
    const s = left !== null ? Math.floor(left / 1000) : 0;
    const p = (n: number) => String(n).padStart(2, '0');
    const old = 'background:#E6EBF3;color:#46536B';
    const nu = 'background:#FF8A24;color:#101B30;font-weight:700';
    const mid = 'background:#101B30;color:#fff';
    const ar = { t: '↓', style: 'width:auto;padding:0;font-size:18px;color:#FF8A24;font-weight:700' };
    const pick = (v: string) => () => setPlan(v);
    const btn = (hot?: boolean) => 'display:flex;align-items:center;justify-content:center;text-align:center;min-height:48px;box-sizing:border-box;padding:10px 12px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;' + (hot ? 'background:#FF8A24;color:#101B30' : 'border:2px solid #101B30;color:#101B30');
    const card = (hot?: boolean) => 'flex:1 1 220px;box-sizing:border-box;border-radius:14px;padding:24px 20px;display:flex;flex-direction:column;gap:12px;position:relative;' + (hot ? 'border:3px solid #FF8A24;background:#FFF8F0' : 'border:1px solid #D5DDEA;background:#fff');
    const badge = (hot?: boolean) => hot ? 'position:absolute;top:-14px;left:20px;background:#FF8A24;color:#101B30;font-size:13px;font-weight:700;padding:2px 12px;border-radius:999px' : 'display:none';
    const defs = [
      { name: '無料相談', price: '¥0', tax: '', who: 'まず状況を確認したい方', cta: '無料で相談する', items: ['現在のホームページURL確認', '移行方法の一次診断', '独自ドメイン利用状況の確認', '概算見積もり'] },
      { name: 'Standard', price: '¥150,000', tax: '（税別）', who: '今のサイトをそのまま移行したい方', cta: 'Standardについて相談する', items: ['既存ホームページの移行', 'テキスト・画像の移行支援', '既存デザインの基本再現', 'スマートフォン対応', '独自ドメイン切替支援', '基本SEO設定'], footnote: '既存ページ数10Pまでの対応' },
      { name: 'Premium', price: '¥300,000', tax: '（税別）', who: '移行を機にサイトを見直したい方', cta: 'Premiumについて相談する', hot: true, items: ['Standardの全内容', 'サイトデザインの刷新', 'CTA・問い合わせ導線改善', 'SEO構造の見直し', 'コンテンツ配置の最適化'], footnote: '既存ページ数11P以上の対応はPremium料金で対応' },
      { name: 'Premium＋ARI', price: '¥400,000', tax: '（税別）', who: 'ARIの導入も検討している方', cta: 'Premium＋ARIについて相談する', items: ['Premiumの全内容', 'ARI導入', 'ARI初期設定', '対応機能の接続・動作検証'] }
    ];
    const Y = '✓', N = '—';
    const rowDefs: [string, string[]][] = [
      ['価格', ['¥0', '¥150,000（税別）', '¥300,000（税別）', '¥400,000（税別）']],
      ['既存ホームページの移行', [N, Y, Y, Y]],
      ['テキスト・画像の移行支援', [N, Y, Y, Y]],
      ['既存デザインの基本再現', [N, Y, Y, Y]],
      ['スマートフォン対応', [N, Y, Y, Y]],
      ['独自ドメイン切替支援', [N, Y, Y, Y]],
      ['基本SEO設定', [N, Y, Y, Y]],
      ['サイトデザインの刷新', [N, N, Y, Y]],
      ['CTA・問い合わせ導線改善', [N, N, Y, Y]],
      ['SEO構造の見直し', [N, N, Y, Y]],
      ['コンテンツ配置の最適化', [N, N, Y, Y]],
      ['ARI導入・初期設定', [N, N, N, Y]],
      ['対応機能の接続・動作検証', [N, N, N, Y]]
    ];
    const vals = {
      onPlan: (e: any) => setPlan(e.target.value),
      plans: defs.map((d) => ({ name: d.name, price: d.price, tax: d.tax, who: d.who, cta: d.cta, items: d.items, footnote: (d as { footnote?: string }).footnote, cardStyle: card(d.hot), badgeStyle: badge(d.hot), btnStyle: btn(d.hot), pick: pick(d.name === '無料相談' ? '無料相談' : d.name) })),
      rows: rowDefs.map((r, ri) => ({ label: r[0], cells: r[1].map((t, ci) => ({ t, style: 'padding:12px 8px;text-align:center;' + (ci === 2 ? 'background:#FFF4E8;' : '') + (t === Y ? 'font-weight:700;color:#14694A;' : (t === N ? 'color:#8A96AB;' : 'font-weight:700;')) })) })),
      running: left !== null && left > 0,
      ended: left === 0,
      units: !mounted
        ? [
            { value: PLACEHOLDER, label: '日', color: '#C9D3E5' },
            { value: PLACEHOLDER, label: '時間', color: '#C9D3E5' },
            { value: PLACEHOLDER, label: '分', color: '#C9D3E5' },
            { value: PLACEHOLDER, label: '秒', color: '#C9D3E5' },
          ]
        : [
            { value: String(Math.floor(s / 86400)), label: '日', color: '#FF8A24' },
            { value: p(Math.floor(s % 86400 / 3600)), label: '時間', color: '#fff' },
            { value: p(Math.floor(s % 3600 / 60)), label: '分', color: '#fff' },
            { value: p(s % 60), label: '秒', color: '#fff' },
          ],
      patterns: [
        { key: 'A', title: 'Ameba Ownd 無料サブドメイン利用', flow: [{ t: 'example.amebaownd.com', style: old }, ar, { t: 'コンテンツ保全・再構築', style: mid }, ar, { t: 'new-example.jp（例）', style: nu }], note: '新ドメインは説明用の例です。新URLへの移行案内も支援します。' },
        { key: 'B', title: '独自ドメイン利用', flow: [{ t: 'www.example.jp', style: old }, ar, { t: 'DNS / Hosting 切替', style: mid }, ar, { t: 'www.example.jp（同じURL）', style: nu }], note: 'DNS設定・ドメイン管理権限・移行先の技術条件によって、対応可否が変わります。' },
        { key: 'C', title: '既存サイトを改善しながら移行', flow: [{ t: '旧サイト', style: old }, ar, { t: 'デザイン改善', style: mid }, ar, { t: '新サイト', style: nu }], note: 'スマホ対応・問い合わせ導線・基本SEO設定の改善を含めて再構築します。' }
      ],
      steps: [
        { n: '01', label: '無料相談', detail: '現状ヒアリングと進め方の整理', icon: 'M4 5h18v13H11l-5 4v-4H4z' },
        { n: '02', label: '現状確認', detail: 'URL・ドメイン・構成・Export状況の確認', icon: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l6 6' },
        { n: '03', label: '見積・契約', detail: 'プランと作業範囲の確定', icon: 'M6 3h10l4 4v16H6zM10 12h6M10 17h6' },
        {
          n: '04',
          label: 'データ保全・再構築',
          detail: 'Exportデータ取得、コンテンツ移行、必要に応じた再構築、画像・リンクの確認',
          icon: 'M13 3L5 14h7l-1 9 9-12h-7z',
        },
        {
          n: '05',
          label: '公開・動作確認',
          detail: '独自ドメイン / DNS切替、公開、表示・動作の確認',
          icon: 'M4 13l6 6L22 6',
        },
      ],
      faqs: FAQS.map((f) => ({ q: f.q, a: f.a }))
    };
  const { units, plans, rows, patterns, steps, faqs, onPlan } = vals;
  const ended = mounted && vals.ended;
  const showCountdown = !ended;
  return (
    <>
<StructuredData />
<div style={css("background:#fff;overflow-x:hidden")}>

<section style={css("background:#101B30;color:#fff;padding:64px 24px 72px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:28px;align-items:center;text-align:center")}>
<p style={css("margin:0;font-size:14px;color:#FF8A24;font-weight:700;letter-spacing:.08em")}>Ameba Ownd サービス終了のお知らせ</p>
<h1 style={css("margin:0;font-size:clamp(28px,5vw,48px);line-height:1.3")}>Ameba Ownd のサービス終了は<br />2027年3月31日へ延期されました。</h1>
<p style={css("margin:0;max-width:720px;color:#FF8A24;font-size:17px;font-weight:700")}>ただし、記事・ページの投稿・更新機能は停止したままです。</p>
<p style={css("margin:0;max-width:720px;color:#C9D3E5;font-size:16px;line-height:1.75")}>現在のサイトを閲覧できる期間は延長されましたが、事業サイトとして必要な情報更新ができない状態は続いています。<br />店舗・企業・個人事業のホームページを、独自ドメインや既存コンテンツも含めて次のWeb環境へ移行支援します。</p>

<div style={css("width:100%;max-width:760px;display:flex;flex-direction:column;gap:12px;align-items:center")}>
{showCountdown && (<>
<p style={css("margin:0;font-size:14px;color:#C9D3E5")}>サービス終了まで</p>
<div style={css("width:100%;display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));gap:12px")}>
{units.map((u, _u)=>(<Fragment key={_u}>
<div style={css("background:#16264A;border:1px solid #2B3C63;border-radius:12px;padding:16px 4px;display:flex;flex-direction:column;align-items:center;gap:2px")}>
<span style={css(`font-family:ui-monospace,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums;font-weight:700;font-size:clamp(32px,8vw,64px);line-height:1.1;color:${u.color}`)}>{u.value}</span>
<span style={css("font-size:13px;color:#C9D3E5")}>{u.label}</span>
</div>
</Fragment>))}
</div>
</>)}
{ended && (<>
<p style={css("margin:0;font-size:20px;font-weight:700;color:#FF8A24")}>Ameba Ownd のサービス終了日時を迎えました</p>
</>)}
<p style={css("margin:0;font-size:14px;color:#C9D3E5")}>終了日時：{SITE.serviceEndDisplay}　出典：<a href={SITE.officialNoticeUrl} style={css("color:#fff")}>Ameba Ownd 公式最新情報</a></p>
</div>

<div style={css("display:flex;flex-wrap:wrap;gap:12px;justify-content:center")}>
<a href="#consult" style={css("background:#FF8A24;color:#101B30;font-weight:700;font-size:18px;padding:16px 32px;border-radius:10px;text-decoration:none;min-height:44px;box-sizing:border-box")}>無料で移行について相談する</a>
<a href="#patterns" style={css("border:2px solid #fff;color:#fff;font-weight:700;font-size:16px;padding:14px 28px;border-radius:10px;text-decoration:none;min-height:44px;box-sizing:border-box")}>移行できるか確認する</a>
</div>
<p style={css("margin:0;font-size:14px;color:#C9D3E5")}>独自ドメイン利用中の方もご相談ください</p>

<div style={css("width:100%;display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:center;margin-top:16px")}>
<div className="bw">
<div className="bar"><span className="dot"></span><span className="dot"></span><span className="dot"></span><span style={css("font-size:11px;color:#46536B;margin-left:8px")}>example.amebaownd.com</span></div>
<div style={css("padding:16px;opacity:.55")}><div className="ln" style={css("width:60%;height:12px;background:#B7C2D6")}></div><div className="ln"></div><div className="ln" style={css("width:80%")}></div><div style={css("height:48px;border-radius:8px;background:#E6EBF3;margin-top:12px")}></div></div>
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={css("position:absolute;top:56px;right:16px")} aria-hidden="true"><circle cx="22" cy="22" r="20" fill="#E5484D"/><path d="M22 12v13M22 31v1" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"/></svg>
<div style={css("padding:0 16px 16px")}><span className="tag" style={css("background:#FFF0E0;color:#9A5B00;margin-top:0")}>情報の更新ができない</span></div>
</div>
<div className="arr" aria-hidden="true"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#FF8A24"/><path d="M14 24h19M26 16l8 8-8 8" stroke="#101B30" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
<div className="bw">
<div className="bar"><span className="dot"></span><span className="dot"></span><span className="dot"></span><span style={css("font-size:11px;color:#46536B;margin-left:8px")}>www.example.jp</span></div>
<div style={css("padding:16px")}><div className="ln" style={css("width:60%;height:12px;background:#101B30")}></div><div className="ln"></div><div className="ln" style={css("width:80%")}></div><div style={css("height:48px;border-radius:8px;background:#FF8A24;margin-top:12px;opacity:.85")}></div></div>
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={css("position:absolute;top:56px;right:16px")} aria-hidden="true"><circle cx="22" cy="22" r="20" fill="#1F9D6B"/><path d="M13 23l7 7 12-14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
<div style={css("padding:0 16px 16px")}><span className="tag" style={css("background:#E1F5EC;color:#14694A;margin-top:0")}>新しい環境で公開継続</span></div>
</div>
</div>
</div>
</section>

<section style={css("padding:64px 24px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:20px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px);line-height:1.4")}>終了日は延期されました。<br />しかし、Webサイトの更新機能は戻っていません。</h2>
<figure style={css("margin:0;width:100%")}>
<img
  src="/ameba-ownd-schedule-update.jpg"
  alt="Ameba Ownd サービス終了スケジュール更新。2026年12月24日から2027年3月31日11時頃へ延期。閲覧は3月31日まで継続、記事・ページ更新は再開しない、データExportは11月18日提供開始。"
  width={1024}
  height={576}
  style={css("width:100%;height:auto;border-radius:12px;display:block;box-shadow:0 8px 24px rgba(16,27,48,.12)")}
/>
</figure>
<p style={css("margin:0;font-size:16px;color:#46536B;line-height:1.75")}>Ameba Owndのサービス終了日は2027年3月31日へ延期されました。一方で、記事・ページの投稿・更新機能は停止したままです。現在のサイトを閲覧することはできますが、次のような事業サイトとして必要な情報を更新できない状態が続いています。</p>
<ul style={css("margin:0;padding-left:20px;font-size:15px;color:#46536B;display:flex;flex-direction:column;gap:6px")}>
<li>営業時間</li>
<li>料金</li>
<li>サービス内容</li>
<li>お知らせ</li>
<li>施工事例</li>
<li>ブログ</li>
</ul>
<p style={css("margin:0;font-size:15px;color:#101B30;font-weight:700;line-height:1.6")}>終了日まで待つのではなく、事業サイトとして正常に更新・運用できる環境へ移行することをおすすめします。</p>
</div>
</section>

<section id="export" style={css("background:#F3F6FA;padding:64px 24px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:20px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px);line-height:1.4")}>データを書き出すだけでは、<br />Webサイトの移行完了ではありません。</h2>
<p style={css("margin:0;font-size:15px;color:#46536B;line-height:1.75")}>Ameba Owndでは2026年11月18日から、管理画面の「コンテンツのエクスポート」により記事・ページ等のデータを書き出せます（利用期限は{SITE.serviceEndDisplay}まで）。ただし、エクスポートファイルを保存しただけでは、新しいサイトでの公開には至りません。</p>
<div style={css("background:#fff;border-radius:12px;border:1px solid #D5DDEA;padding:24px;display:flex;flex-direction:column;gap:12px")}>
<p style={css("margin:0;font-size:15px;font-weight:700")}>公式エクスポートで確認できる主な点</p>
<ul style={css("margin:0;padding-left:20px;font-size:14px;color:#46536B;display:flex;flex-direction:column;gap:6px")}>
<li>記事・ページ・カテゴリ・下書きなどを書き出し可能（形式は WordPress用 zip または Amebaブログ用テキストなど）</li>
<li>ファイルには画像そのものではなく<strong>画像のURL</strong>が含まれます。画像は移行先への取り込み時にAmeba Owndから取得されます</li>
<li>サイトのデザイン設定やテーマなどはエクスポート対象外です</li>
</ul>
</div>
<p style={css("margin:0;font-size:15px;color:#46536B;line-height:1.75")}>移行を完了するには、エクスポートに加えて、移行先への取り込み、画像の表示確認、リンク確認、独自ドメインの切替などが必要になる場合があります。画像を含めて移行する場合は、サービス終了前に取り込みと表示確認まで余裕をもって進めることが重要です（詳細は<a href={SITE.officialNoticeUrl} style={css("color:#101B30")}>Ameba Ownd 公式最新情報</a>をご確認ください）。</p>
</div>
</section>

<section style={css("background:#F3F6FA;padding:64px 24px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:28px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px)")}>ホームページを放置すると、何が起こる？</h2>
<div style={css("display:flex;flex-wrap:wrap;gap:16px")}>
<div style={css("flex:1 1 260px;background:#fff;border-radius:12px;overflow:hidden")}>
<div style={css("background:#FDE8E9;padding:20px;display:flex;justify-content:center")}><svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true"><rect x="10" y="8" width="84" height="60" rx="8" fill="#fff" stroke="#101B30" strokeWidth="3"/><path d="M10 24h84" stroke="#101B30" strokeWidth="3"/><circle cx="92" cy="58" r="18" fill="#E5484D"/><path d="M92 48v12M92 66v1" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></svg></div>
<div style={css("padding:20px")}><span style={css("font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#E5484D")}>01</span><p style={css("margin:4px 0 6px;font-weight:700;font-size:18px")}>ホームページ公開終了</p><p style={css("margin:0;font-size:14px;color:#46536B")}>終了日時を過ぎると、現在のサイトを閲覧できなくなります。</p></div>
</div>
<div style={css("flex:1 1 260px;background:#fff;border-radius:12px;overflow:hidden")}>
<div style={css("background:#FFF0E0;padding:20px;display:flex;justify-content:center")}><svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true"><rect x="8" y="14" width="56" height="40" rx="6" fill="#fff" stroke="#101B30" strokeWidth="3"/><path d="M10 18l26 20 26-20" stroke="#101B30" strokeWidth="3"/><rect x="50" y="30" width="46" height="40" rx="6" fill="#fff" stroke="#101B30" strokeWidth="3"/><path d="M50 42h46" stroke="#101B30" strokeWidth="3"/><circle cx="96" cy="60" r="16" fill="#E5484D"/><path d="M89 53l14 14M103 53L89 67" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></svg></div>
<div style={css("padding:20px")}><span style={css("font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#E5484D")}>02</span><p style={css("margin:4px 0 6px;font-weight:700;font-size:18px")}>問い合わせ・予約機会の損失</p><p style={css("margin:0;font-size:14px;color:#46536B")}>サイト上のフォームや予約ページが使えなくなる可能性があります。</p></div>
</div>
<div style={css("flex:1 1 260px;background:#fff;border-radius:12px;overflow:hidden")}>
<div style={css("background:#E8EEF9;padding:20px;display:flex;justify-content:center")}><svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true"><circle cx="38" cy="34" r="22" fill="#fff" stroke="#101B30" strokeWidth="3"/><path d="M54 50l16 16" stroke="#101B30" strokeWidth="5" strokeLinecap="round"/><path d="M26 28l10 8 8-4 8 10" stroke="#E5484D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M80 30v30h30" stroke="#101B30" strokeWidth="3" strokeLinecap="round"/><path d="M84 36l12 10 8-4 6 10" stroke="#E5484D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
<div style={css("padding:20px")}><span style={css("font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#E5484D")}>03</span><p style={css("margin:4px 0 6px;font-weight:700;font-size:18px")}>検索流入・顧客接点への影響</p><p style={css("margin:0;font-size:14px;color:#46536B")}>新URLへの案内がない場合、検索経由で見つけてもらいにくくなる可能性があります。</p></div>
</div>
</div>
<p style={css("margin:0;font-size:13px;color:#46536B")}>※ 影響の程度はサイトの構成や運用状況によって異なります。</p>
</div>
</section>

<section id="patterns" style={css("padding:64px 24px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:28px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px)")}>対応できる移行パターン</h2>
<div style={css("display:flex;flex-wrap:wrap;gap:16px")}>
{patterns.map((p, _p)=>(<Fragment key={_p}>
<div style={css("flex:1 1 260px;border:1px solid #D5DDEA;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:8px")}>
<span style={css("font-weight:700;color:#FF8A24;font-size:14px")}>パターン {p.key}</span>
<p style={css("margin:0;font-size:18px;font-weight:700")}>{p.title}</p>
<div className="fl">
{p.flow.map((f, _f)=>(<Fragment key={_f}>
<div className="fb" style={css(`${f.style}`)}>{f.t}</div>
</Fragment>))}
</div>
<p style={css("margin:0;font-size:13px;color:#46536B")}>{p.note}</p>
</div>
</Fragment>))}
</div>
<div style={css("background:#F3F6FA;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:8px")}>
<p style={css("margin:0;font-size:15px;line-height:1.7")}>WordPress / Studio.Designなど、サイトの用途・更新方法・運用体制に合わせて移行先をご提案します。</p>
<p style={css("margin:0;font-size:14px;color:#46536B;line-height:1.6")}>移行先によって、データの取り込み方法・変換・再構築方法が異なります。Ameba Ownd公式エクスポートの対象や形式は移行先ごとに異なるため、事前の現状確認のうえ最適な方法をご案内します。</p>
</div>
</div>
</section>

<section style={css("background:#F3F6FA;padding:64px 24px")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:28px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px)")}>移行までの流れ</h2>
<div className="tl">
{steps.map((s, _s)=>(<Fragment key={_s}>
<div className="st">
<div className="ic"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#101B30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.icon}/></svg></div>
<div><span style={css("font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#FF8A24;font-size:14px")}>{s.n}</span><p style={css("margin:0;font-weight:700")}>{s.label}</p><p style={css("margin:4px 0 0;font-size:13px;color:#46536B;line-height:1.5")}>{s.detail}</p></div>
</div>
</Fragment>))}
</div>
<p style={css("margin:0;font-size:14px;color:#46536B")}>※ 移行作業には、既存サイト管理者の協力やドメイン管理権限が必要になる場合があります。所要期間はサイトの状況を確認してご案内します。</p>
</div>
</section>

<section id="pricing" style={css("padding:64px 24px")}>
<div style={css("max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:24px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px)")}>料金</h2>
<div style={css("display:flex;flex-wrap:wrap;gap:16px;align-items:stretch")}>
{plans.map((p, _p)=>(<Fragment key={_p}>
<div style={css(`${p.cardStyle}`)}>
<span style={css(`${p.badgeStyle}`)}>おすすめ</span>
<p style={css("margin:0;font-size:20px;font-weight:700")}>{p.name}</p>
<p style={css("margin:0;font-family:ui-monospace,Menlo,monospace;font-size:30px;font-weight:700;line-height:1.2")}>{p.price}<span style={css("font-family:inherit;font-size:13px;font-weight:400;color:#46536B")}>{p.tax}</span></p>
<p style={css("margin:0;font-size:13px;color:#46536B")}>{p.who}</p>
<ul style={css("margin:0;padding-left:18px;font-size:14px;display:flex;flex-direction:column;gap:4px;flex:1")}>
{p.items.map((i, _i)=>(<Fragment key={_i}><li>{i}</li></Fragment>))}
</ul>
{p.footnote ? <p style={css("margin:0;font-size:12px;color:#46536B;line-height:1.5")}>・{p.footnote}</p> : null}
<a href="#consult" onClick={p.pick} style={css(`${p.btnStyle}`)}>{p.cta}</a>
</div>
</Fragment>))}
</div>
<h3 style={css("margin:16px 0 0;font-size:20px")}>プラン比較</h3>
<div style={css("overflow-x:auto;border:1px solid #D5DDEA;border-radius:12px")}>
<div style={css("min-width:680px")}>
{rows.map((r, _r)=>(<Fragment key={_r}>
<div style={css("display:grid;grid-template-columns:minmax(200px, 1.8fr) repeat(4, minmax(100px, 1fr));border-bottom:1px solid #E6EBF3;font-size:14px")}>
<div style={css("padding:12px 16px;font-weight:700")}>{r.label}</div>
{r.cells.map((c, _c)=>(<Fragment key={_c}><div style={css(`${c.style}`)}>{c.t}</div></Fragment>))}
</div>
</Fragment>))}
</div>
</div>
<div style={css("background:#F3F6FA;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:8px")}>
<p style={css("margin:0;font-size:14px")}>表示価格は税別です。サイト規模・記事数・特殊機能・移行先環境により追加費用が発生する場合があります。正式な費用はサイト確認後のお見積もりにてご案内します。</p>
<p style={css("margin:0;font-size:14px;color:#46536B")}>移行先サービスの利用料、ドメイン更新料、保守費用は別途となります。</p>
</div>
</div>
</section>

<section style={css("background:#F3F6FA;padding:64px 24px")}>
<div style={css("max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:16px")}>
<h2 style={css("margin:0;font-size:clamp(24px,4vw,34px)")}>よくある質問</h2>
{faqs.map((f, _f)=>(<Fragment key={_f}>
<details style={css("background:#fff;border-radius:10px;padding:4px 20px")}>
<summary style={css("font-weight:700")}>{f.q}</summary>
<p style={css("margin:0 0 16px;font-size:14px;color:#46536B")}>{f.a}</p>
</details>
</Fragment>))}
</div>
</section>

<section id="consult" style={css("background:#101B30;color:#fff;padding:72px 24px")}>
<div style={css("max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:24px")}>
<div style={css("text-align:center")}>
<h2 style={css("margin:0 0 12px;font-size:clamp(24px,4vw,34px);line-height:1.4")}>事業サイトとして更新できる環境へ。<br />移行方法を確認しませんか？</h2>
<p style={css("margin:0;color:#C9D3E5;font-size:14px")}>終了日時：{SITE.serviceEndDisplay}</p>
</div>
<ContactForm plan={plan} setPlan={setPlan} />
</div>
</section>

<footer style={css("background:#0A1222;color:#C9D3E5;padding:48px 24px calc(32px + env(safe-area-inset-bottom, 0px))")}>
<div style={css("max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:24px")}>
<div style={css("display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:flex-start")}>
<div style={css("display:flex;flex-direction:column;gap:6px;flex:1 1 280px")}>
<p style={css("margin:0;font-size:18px;font-weight:700;color:#fff")}>{SITE.name}</p>
<p style={css("margin:0;font-size:13px")}>運営：合同会社コア・リテール</p>
</div>
<nav aria-label="フッターメニュー" style={css("display:flex;flex-wrap:wrap;gap:8px 24px;font-size:14px;flex:1 1 280px")}>
<a href="#pricing" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>料金</a>
<a href="#patterns" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>移行パターン</a>
<a href="#consult" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>無料相談</a>
<a href={SITE.officialNoticeUrl} style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>Ameba Ownd 公式最新情報</a>
<a href="/terms" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>利用規約</a>
<a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>プライバシーポリシー</a>
<a href={SITE.companyUrl} target="_blank" rel="noopener noreferrer" style={css("color:#fff;min-height:44px;display:flex;align-items:center")}>会社概要</a>
</nav>
</div>
<div style={css("border-top:1px solid #2B3C63;padding-top:16px;display:flex;flex-direction:column;gap:6px;font-size:12px")}>
<p style={css("margin:0")}>サービス終了日時：{SITE.serviceEndDisplay}。出典は上記の公式最新情報です。</p>
<p style={css("margin:0")}>Ameba Ownd は各権利者の商標または登録商標です。</p>
<p style={css("margin:0")}>© 合同会社コア・リテール</p>
</div>
</div>
</footer>

</div>

    </>
  );
}
