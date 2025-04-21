This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

##　開発について
プロジェクトの開発方針について、以下のようにまとめさせていただきます：

1. **基本アーキテクチャ**
- Next.js App Router採用
- TypeScript完全対応
- TailwindCSSによるスタイリング
- ディレクトリ構造：
  ```
  src/
  ├── app/          # ページルーティング
  ├── components/   # 共通コンポーネント
  ├── lib/         # 共有ロジック
  ├── types/       # 型定義
  └── content/     # Markdownコンテンツ
  ```

2. **コンテンツ管理戦略**
- 静的コンテンツ：Markdownファイル
  - ブログ記事
  - 固定ページコンテンツ
- 動的コンテンツ：Notion Database
  - FAQ管理
  - カテゴリー別の整理（General, Events, Teams等）

3. **実装優先順位**
1️⃣ **エラーハンドリング & ローディング状態**
   - エラーページの実装（グローバル/ルート別）
   - ローディング表示（スケルトンUI）
   - ユーザーフレンドリーなエラーメッセージ

2️⃣ **キャッシュ戦略**
   - React Cacheの実装
   - Notion APIレスポンスのキャッシュ
   - 静的ページ生成の最適化
   - 動的コンテンツの再検証戦略

3️⃣ **アクセシビリティ対応**
   - ARIAラベル/ロールの適切な使用
   - キーボードナビゲーション
   - フォーカス管理
   - カラーコントラスト対応
   - スクリーンリーダー最適化

4️⃣ **分析・モニタリング**
   - Vercel Analytics導入
   - エラートラッキング（Sentry）
   - パフォーマンスモニタリング
   - ユーザー行動分析

4. **開発ガイドライン**
- コンポーネントは全てTailwindCSSを使用
- ページは必ず`app/`ディレクトリに配置
- 共有ロジックは`lib/`に配置
- 型定義は`types/`に配置
- FAQはNotionで管理（ハードコード禁止）

5. **実装の進め方**
- 機能は段階的に実装
- テストカバレッジの維持
- ドキュメントの随時更新
- アクセシビリティテストを開発プロセスに組み込む

6. **品質管理**
- TypeScriptの厳格な型チェック
- ESLintによるコード品質管理
- アクセシビリティテスト
- パフォーマンステスト

この開発方針に従うことで：
- 保守性の高いコードベース
- 優れたユーザー体験
- 効率的なコンテンツ管理
- 堅牢なエラーハンドリング
- アクセシブルなウェブサイト

が実現できると考えています。各フェーズで必要に応じて方針を見直し、より良い実装を目指していきましょう。
