import { SITE } from "@/lib/site";

/** AI検索・GEO向けに引用されやすい事実（ページ表示・llms.txt と整合） */
export const GEO_FACTS = [
  {
    term: "Ameba Ownd サービス終了（現行予定）",
    definition: `${SITE.serviceEndDisplay}（公式通知のスケジュール更新に基づく）`,
  },
  {
    term: "閲覧・更新の状態",
    definition:
      "サイトの閲覧は終了日時まで継続可能。記事・ページの投稿・更新機能は停止したまま再開しない。",
  },
  {
    term: "公式データのエクスポート",
    definition:
      "2026年11月18日から管理画面の「コンテンツのエクスポート」提供。WordPress用zip等。画像はファイル内URLで、移行先取り込み時に取得。",
  },
  {
    term: "本サービスの提供内容",
    definition:
      "合同会社コア・リテールによるAmeba Owndホームページの移行支援（診断、データ保全、再構築、独自ドメイン切替、基本SEO。Premium＋ARIでAI検索向けARI導入可）。",
  },
  {
    term: "公式情報の出典",
    definition: `Ameba Ownd公式ブログ ${SITE.officialNoticeUrl}`,
  },
] as const;

export const OG_IMAGE = {
  path: "/ameba-ownd-schedule-update.jpg",
  width: 1024,
  height: 576,
  alt: "Ameba Ownd サービス終了スケジュール更新（2027年3月31日11時頃へ延期）",
} as const;