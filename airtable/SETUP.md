# Airtable テーブルセットアップ（README 案 A）

## 方法1: スクリプト（PAT に schema 権限がある場合）

1. [Airtable トークン](https://airtable.com/create/tokens) で **schema.bases:read** と **schema.bases:write** を追加（対象 Base を指定）
2. `.env.local` の `AIRTABLE_PAT` を更新
3. 実行:

```bash
# 既存テーブルに不足フィールドを追加
node scripts/setup-airtable-fields.mjs

# または新規テーブル AmebaOwnd_Leads を丸ごと作成（推奨・別用途の列だけのテーブルだった場合）
node scripts/setup-airtable-fields.mjs --create-table
```

`--create-table` 実行後、表示された **Table ID** を `.env.local` の `AIRTABLE_TABLE_ID` に設定する。

4. 接続テスト:

```bash
node scripts/verify-airtable.mjs
```

## 方法2: CSV インポート（schema 権限がない場合）

1. Airtable で対象 Base を開く
2. **Create** → **Import data** → `airtable/AmebaOwnd_Leads_template.csv` を選択
3. テーブル名を **AmebaOwnd_Leads** に変更
4. 列の型を調整:
   - **Email** → Email
   - **Phone** → Phone number
   - **Website URL** → URL
   - **Message** → Long text
   - **Domain Type / Requested Service / Requested Plan / Status** → Single select
   - **Consent Timestamp** → Date（時間含む）
5. フィールド **Created At** を追加 → 型 **Created time**
6. **Lead ID** を先頭列（Primary）にし、必要なら重複禁止を検討
7. テーブル URL の `tbl...` を `.env.local` の `AIRTABLE_TABLE_ID` に設定
8. `node scripts/verify-airtable.mjs` で成功を確認

## フィールド一覧（コードと一致必須）

`Lead ID`, `Company`, `Contact Name`, `Email`, `Phone`, `Website URL`, `Message`, `Domain Type`, `Requested Service`, `Requested Plan`, `Status`, `Source`, `UTM Source`, `UTM Medium`, `UTM Campaign`, `Consent Version`, `Consent Timestamp`, `Created At`（API は Created At を書き込まない）
