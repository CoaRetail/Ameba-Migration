# Ameba Ownd 緊急移行サービス LP

Next.js (App Router) + TypeScript。問い合わせフォームは `app/api/leads/route.ts` からAirtableへ直接保存します（ブラウザからAirtable APIは呼びません）。

## 起動
    npm install
    cp .env.example .env.local   # 値を入力
    npm run dev                  # http://localhost:3000
    npm run build && npm run lint

## 構成
- `app/page.tsx` ページ本体（カウントダウン、料金、プラン自動選択）
- `app/ContactForm.tsx` フォームUI（項目別エラー、送信中の無効化、二重送信防止、Turnstile、Honeypot）
- `app/api/leads/route.ts` 送信API（Origin制限、レート制限、サーバー側検証、Turnstile検証、Airtable保存）
- `lib/leads.ts` 入力検証と選択肢（クライアントとサーバーで共通）

## 環境変数
| 変数 | 内容 |
|---|---|
| AIRTABLE_PAT | Personal Access Token。権限は対象Baseの `data.records:write` のみ |
| AIRTABLE_BASE_ID | `app...` で始まるBase ID |
| AIRTABLE_TABLE_ID | `tbl...` で始まるテーブルID |
| TURNSTILE_SECRET_KEY | Cloudflare Turnstile のシークレットキー（サーバー専用） |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Turnstile のサイトキー（公開してよい） |
| ALLOWED_ORIGINS | 送信を許可するオリジン。本番は必須。未設定の本番は全拒否 |
| SLACK_WEBHOOK_URL | 任意。Airtable 保存成功後の Slack 通知 |
| NEXT_PUBLIC_GTM_ID | Google Tag Manager（例: `GTM-T654738W`）。GA4 は GTM コンテナ内で設定 |

## タグ（GTM + gtag）
- `app/GoogleTagManager.tsx` … `gtm.js` と dataLayer / `gtag()`  bootstrap
- `.env.local` / Vercel に `NEXT_PUBLIC_GTM_ID=GTM-T654738W`
- ページ計測・GA4 設定は **GTM 管理画面**側（Google タグ / GA4 設定タグ）
- フォーム送信成功時: **`generate_lead`** を dataLayer 経由で送信（GTM でトリガー設定可）

## Airtable テーブル案（`AmebaOwnd_Leads`）※新規作成は承認後
| フィールド | 型 |
|---|---|
| Lead ID | 1行テキスト（**一意キー。upsertに使用**） |
| Created At | 作成日時（Created time型。APIからは書き込まない） |
| Company / Contact Name / Email / Phone / Website URL / Message | テキスト・メール・電話・URL・長文テキスト |
| Domain Type / Requested Service / Requested Plan / Status | 単一選択（APIは `typecast` で選択肢を自動追加） |
| Source / UTM Source / UTM Medium / UTM Campaign | 1行テキスト |
| Consent Version / Consent Timestamp | 1行テキスト / 日時 |

Status: New / Contacted / Qualified / Quoted / Won / Lost（新規は `New`）。`Requested Plan` は 無料相談・Standard・Premium・Premium＋ARI・未定・相談したい。

## 保存の仕組み
- 送信IDを `Lead ID` として、Airtableの upsert（`performUpsert`）で保存します。同じ送信の再送で重複登録されません。
- Airtableが失敗・タイムアウトした場合は成功画面を出さず、入力内容を残してエラーを表示します。
- ログに個人情報は出しません。エラー詳細も画面に出しません。

## 注意
- レート制限はサーバーのメモリ上です（5回/10分/IP）。サーバーレスでは不完全なので、Cloudflare WAF等も併用してください。
- `Consent Version` は仮の値 `2026-11-draft` です。プライバシーポリシー確定後に `route.ts` を更新してください。
- 本番では `NEXT_PUBLIC_SITE_URL` に canonical / sitemap / OGP の絶対URL用の本番ドメインを設定してください（未設定時は Vercel の `VERCEL_URL`）。
- SEO: `app/layout.tsx`（メタ・OGP・Twitter）、`app/robots.ts`、`app/sitemap.ts`、`app/StructuredData.tsx`（WebSite / Organization / Service / FAQPage）。
- GEO: 上記 JSON-LD の Service・FAQ、および `public/llms.txt`（AI向け要約）。

## 本番公開前チェックリスト（承認待ち）
- [ ] Airtableの既存Baseを確認し、テーブル作成・フィールド追加を承認
- [ ] テスト送信の宛先Base/テーブルを承認し、1件登録して全フィールド（特に Requested Plan）を確認
- [ ] 本番の環境変数設定、ALLOWED_ORIGINS に本番ドメイン
- [ ] Turnstileに本番ドメインを登録
- [ ] 会社概要のURL差し替え（プライバシーポリシーは設定済み。内容確定後に `Consent Version` を更新）
- [ ] 料金・ARIの提供範囲・納期表記の最終確認
- [x] SEOメタ情報の設定（`NEXT_PUBLIC_SITE_URL` を Vercel に設定）
- [ ] 本番デプロイ・DNS変更の承認
