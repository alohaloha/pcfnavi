# FAQページの実装：実装レポート

## 実装内容のまとめ

1. **FAQコンポーネントの構造設計**
   - `FaqList`: カテゴリごとにFAQ項目を表示するコンテナコンポーネント
   - `FaqItem`: 個別のFAQ項目を表示するアコーディオンコンポーネント
   - データ取得とAPI連携の分離

2. **アコーディオン動作の実装**
   - 質問クリックで簡易回答を表示
   - 「詳しく見る」ボタンで詳細情報を取得・表示
   - 詳細情報は遅延取得（必要になるまで読み込まない）

3. **Notion API連携**
   - FAQ一覧を取得する`fetchFaqList`関数
   - 詳細情報を取得する`fetchFaqDetail`関数
   - サーバーサイドで`use server`ディレクティブを使用した実装

4. **Notionブロックのレンダリング**
   - 様々なブロックタイプ（段落、見出し、リスト、画像など）に対応
   - リッチテキスト（太字、斜体、リンクなど）のサポート
   - エラーハンドリングとローディング状態の表示

5. **型の問題解決**
   - `ReadonlyArray`と`readonly`修飾子を使用して型エラーを解消
   - `categories`プロパティをオプショナルにしてデフォルト値を設定

## 技術的なポイント

1. **サーバーコンポーネントとクライアントコンポーネントの使い分け**
   - サーバー側: データ取得（`page.tsx`）
   - クライアント側: インタラクション（`FaqItem.tsx`, `FaqList.tsx`）

2. **状態管理の分離**
   - アコーディオンの開閉状態（`isOpen`）
   - 詳細情報の表示状態（`showDetail`）
   - ロード状態（`isLoading`）

3. **APIエラーハンドリングとデバッグ**
   - エラーログの出力
   - ローディングインジケーターの表示
   - エラーメッセージの表示

4. **型安全性の確保**
   - `FaqItem`型、`NotionBlock`型などの定義
   - `ReadonlyArray`を使った不変性の確保

## 実装の流れ

1. **定数ファイルの作成**
   - `lib/constants.ts`にサイト全般の定数を定義
   - FAQカテゴリの定義とタイプ設定

2. **API関連の実装**
   - Notion APIと連携するための関数を実装
   - 遅延読み込みのためのAPI設計

3. **コンポーネント実装**
   - アコーディオン型の`FaqItem`コンポーネント作成
   - カテゴリ別表示のための`FaqList`コンポーネント作成

4. **型エラーの解決**
   - `ReadonlyArray`を使用して型互換性を確保
   - オプショナルプロパティとデフォルト値の設定

## 今後の改善点

1. **UIの最適化**
   - モバイル対応の改善
   - アニメーションの洗練

2. **エラーハンドリングの強化**
   - ユーザーフレンドリーなエラーメッセージ
   - リトライ機能

3. **パフォーマンス最適化**
   - キャッシュ戦略の改善
   - 大量のFAQ項目がある場合の対応

## コード構成

```tsx
// src/lib/faq.ts - データ取得関数
'use server'
export async function fetchFaqList(): Promise<FaqItem[]> { ... }
export async function fetchFaqDetail(pageId: string): Promise<any[]> { ... }

// src/components/FaqList.tsx - 一覧表示コンポーネント
'use client'
export default function FaqList({ faqs, categories = FAQ_CATEGORIES }: FaqListProps) { ... }

// src/components/FaqItem.tsx - 個別アコーディオンコンポーネント
'use client'
export default function FaqItem({ id, question, summary, fetchDetail }: FaqItemProps) { ... }

// src/app/(routes)/faq/page.tsx - ページコンポーネント
export default async function FaqPage() {
  const faqList = await fetchFaqList();
  return <FaqList faqs={faqList} />;
}
```

この実装により、ユーザーにとって使いやすく、開発者にとって保守しやすいFAQセクションが完成しました。Notionをバックエンドとして利用することで、コンテンツ管理も容易になっています。 