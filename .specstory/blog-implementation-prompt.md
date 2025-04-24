# Notionと連携したBLOGページ実装ガイド

## プロジェクト概要

PCF Naviのブログ機能をNotion APIを使用して実装します。FAQページの実装を参考にしながら、以下の点で異なるアプローチを取ります：

- FAQでは詳細をアコーディオン形式で同一ページ内で表示
- ブログでは詳細を別ページに遷移して表示

## 技術スタック

- **フロントエンド**: Next.js (App Router), React, TypeScript, TailwindCSS
- **コンテンツ管理**: Notion Database API
- **デプロイ**: Vercel

## 実装すべき機能

1. **ブログ一覧ページ**
   - 記事のサムネイル、タイトル、概要、カテゴリ、投稿日の表示
   - カテゴリ別フィルタリング
   - 新着順ソート

2. **ブログ詳細ページ**
   - 動的ルーティング（`/blog/[slug]`）
   - NotionブロックのReactコンポーネントへの変換
   - 関連記事の表示

3. **APIエンドポイント**
   - ブログ一覧取得API
   - ブログ詳細取得API

# 参照する機能

1. **FAQ関連ページ**
    - コンポーネント
        - `src/app/(routes)/faq/page.tsx（一覧ページの実装例）`
        - `src/components/FaqList.tsx（リスト表示の参照用）`
        - `src/components/FaqItem.tsx（個別アイテム表示の参照用）`
    - データ取得ロジック:
        - `src/app/api/faq/route.ts（一覧取得のAPI実装例） `
        - `src/app/api/faq/detail/[id]/route.ts（詳細取得のAPI実装例）`
        - `src/lib/faq.ts（サーバーアクションの実装例）`
        -`src/lib/constants.ts（定数定義の参照用）`
        - `src/lib/notionParser.tsx（Notionブロックのパース処理）`
        
## データベース設計

Notion上に以下のデータベースを作成：

- **ブログデータベース**
  - `title`: タイトル (title)
  -`slug`: URL用スラッグ（text）
  - `URL`: 引用元URL (url)
  - `summary`: 概要 (text)
  - `cover`: カバー画像 (files & media)
  - `category`: カテゴリ (multi-select)
  - `publishedAt`: 公開日 (date)
  - `featured`: 注目記事か (checkbox)
  - `status`: 公開状態 (select) - 「公開」「下書き」「非公開」など
  - `isNew`: 新着かどうか（formula）

## 実装の流れ

1. **APIルートハンドラーの実装**
   - BLOG用に新たに使用する定数は
        - `BLOG_CATEGORIES `
        - `BlogCategoryName`
        - `BlogCategoryKey`
        - `NOTION_BLOG_DB_ID`
   - `/api/blog` - ブログ一覧の取得
   - `/api/blog/[slug]` - 特定のブログ記事の取得

2. **サーバーアクション・ユーティリティの実装**
   - `lib/blog.ts` - サーバーアクションでブログデータを取得
   - NotionParser共通ロジックを再利用

3. **コンポーネントの実装**
   - `BlogList` - ブログ記事一覧を表示
   - `BlogCard` - 個別の記事カードを表示
   - `BlogDetail` - ブログ詳細を表示

4. **ページの実装**
   - `app/(routes)/blog/page.tsx` - ブログ一覧ページ
   - `app/(routes)/blog/[slug]/page.tsx` - ブログ詳細ページ

## 共通ユーティリティの再利用

FAQページで既に実装済みの以下の機能を再利用します：

- `notionParser.tsx` - Notionブロックを解析してReactコンポーネントに変換
- キャッシュ戦略
- エラーハンドリング

## ポイント

1. **SEO対策**
   - メタデータの適切な設定
   - 静的生成の活用
   - OGP画像の設定

2. **パフォーマンス最適化**
   - ブログ一覧ページのページネーション
   - 画像の最適化
   - Incremental Static Regeneration (ISR)の活用

3. **UX改善**
   - ローディング状態の表示
   - エラーハンドリング
   - アニメーション

## 実装の注意点

- FAQと同様にデータフェッチングはAPIルートを使用
- サーバーコンポーネントとクライアントコンポーネントの適切な使い分け
- 型安全性の確保
- データ不足時の適切な代替表示

## ページ遷移の実装

FAQとは異なり、ブログでは詳細ページへの遷移を実装します：

1. 一覧ページでは`Link`コンポーネントを使用して各記事カードをリンク化
2. URLパラメータとして`slug`を使用
3. 詳細ページでは`getStaticPaths`や`generateStaticParams`を活用して静的生成

## 参考にするファイル

- 一覧取得: `src/app/api/faq/route.ts`
- 詳細取得: `src/app/api/faq/detail/[id]/route.ts`
- Notionパーサー: `src/lib/notionParser.tsx`
- データ取得ロジック: `src/lib/faq.ts`
- 一覧表示: `src/components/FaqList.tsx` 