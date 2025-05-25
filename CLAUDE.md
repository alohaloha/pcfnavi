# PCF NAVI - 電動車椅子サッカー情報ポータル

## プロジェクト概要

電動車椅子サッカーの情報発信を目的としたNext.jsベースの情報ポータルサイトです。イベント、ブログ、FAQ、カレンダー、ギャラリー機能を提供します。

### 設計思想
- **アクセシビリティファースト** - 障害者スポーツサイトとして、WCAG 2.1 AA準拠を最優先
- **インクルーシブデザイン** - 多様なユーザーが利用しやすいUI/UX
- **パフォーマンス重視** - 高速な情報アクセスを実現

## 技術スタック

### コアフレームワーク
- **Next.js 15.3.1** - React App Router使用
- **React 19.0.0** - メインUI フレームワーク
- **TypeScript 5.8.3** - 型安全な開発

### UI・スタイリング
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **shadcn/ui** - Radix UIベースのコンポーネントライブラリ（アクセシビリティ標準準拠）
- **Lucide React** - アイコンライブラリ
- **Heroicons** - 追加アイコン
- **CSS Variables** - テーマシステム

#### shadcn/ui 使用方針
- **アクセシビリティファースト** - WAI-ARIA準拠のRadix UIベース
- **カスタマイズ可能** - CSS VariablesとTailwindでテーマ調整
- **型安全性** - TypeScript完全対応
- **一貫性** - デザインシステムによる統一されたUI/UX

### データ管理
- **Notion API** - コンテンツ管理（ブログ、FAQ）
- **Supabase** - データベース（イベント情報）
- **Upstash Redis** - キャッシュレイヤー
- **Zustand** - 軽量状態管理

### 開発ツール
- **ESLint** - コード品質管理
- **ts-node** - TypeScriptスクリプト実行
- **date-fns** - 日付処理
- **Zod** - バリデーション

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # ルートグループ
│   │   ├── about/         # About ページ
│   │   ├── blog/          # ブログ機能
│   │   ├── calendar/      # カレンダー機能
│   │   ├── event/         # イベント機能
│   │   ├── faq/           # FAQ機能
│   │   ├── gallery/       # ギャラリー機能
│   │   ├── privacy-policy/# プライバシーポリシー
│   │   └── rules/         # ルール説明
│   ├── api/               # API Routes
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/ui コンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── event/            # イベント関連コンポーネント
│   ├── gallery/          # ギャラリー関連コンポーネント
│   ├── home/             # ホーム関連コンポーネント
│   └── icon/             # カスタムアイコン
├── lib/                  # 共有ロジック
│   ├── server/           # サーバーサイドロジック
│   └── utils/            # ユーティリティ関数
├── types/                # TypeScript型定義
├── hooks/                # カスタムReact Hooks
└── scripts/              # 運用スクリプト
```

## コーディング規約

### TypeScript
- **厳格な型チェック** - `strict: true`
- **明示的な戻り値の型** - 関数は戻り値の型を明記
- **Interface over Type** - 型定義はinterfaceを優先
- **named export** - default exportよりnamed exportを推奨

### React Components
- **関数コンポーネント** - function宣言を使用
- **Props interface** - 全てのPropsに型定義を設定
- **Component naming** - PascalCaseを使用
- **ファイル名** - コンポーネント名と一致させる（例: `EventCard.tsx`）

```typescript
// ✅ Good
interface EventCardProps {
  event: EventItem;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return <div>...</div>;
}

// ❌ Bad
export default ({ event, onClick }) => {
  return <div>...</div>;
}
```

### CSS/Styling
- **Tailwind CSS** - 全てのスタイリングはTailwindを使用
- **shadcn/ui カスタマイズ** - プロジェクト専用のテーマとカラーパレット適用
- **カスタムカラーパレット** - `tailwind.config.ts`で定義された色を使用
  - `primary`: メインカラー (#4B6577)
  - `accent`: アクセントカラー (#3AA89F)  
  - `secondary`: セカンダリカラー (#88C070)
  - `cta`: CTAカラー (#F9C54E)
  - `cream`: 背景色 (#F8F6EF)
- **レスポンシブデザイン** - モバイルファースト
- **CSS Variables** - カスタムプロパティを活用

#### コンポーネントカスタマイズ方針
- **shadcn/ui ベース** - 標準コンポーネントを基盤として使用
- **プロジェクト固有の拡張** - 必要に応じてカスタムプロパティを追加
- **一貫性の維持** - デザインシステムに従った統一されたルック&フィール
- **アクセシビリティ保持** - カスタマイズ時もWCAG 2.1 AA準拠を維持

```typescript
// ✅ Good
<div className="bg-primary-500 text-white p-4 md:p-6">

// ❌ Bad
<div style={{ backgroundColor: '#4B6577', color: 'white', padding: '16px' }}>
```

### ファイル・フォルダ命名
- **フォルダ名** - kebab-case（例: `event-detail`）
- **コンポーネントファイル** - PascalCase（例: `EventCard.tsx`）
- **ユーティリティファイル** - kebab-case（例: `event-parser.tsx`）
- **型定義ファイル** - kebab-case（例: `event.ts`）

## 開発方針

### コンテンツ管理戦略
- **静的コンテンツ** - Markdownファイルで管理
- **動的コンテンツ** - Notion Database / Supabaseで管理
- **画像** - public/imagesディレクトリで管理
- **キャッシュ** - Upstash Redisでパフォーマンス最適化

### API設計
- **REST API** - `/api`ルートで統一
- **型安全性** - 全API レスポンスに型定義
- **エラーハンドリング** - 統一されたエラーレスポンス
- **キャッシュ戦略** - 適切なCache-Controlヘッダー

### データフェッチング
- **Server Components** - デフォルトで使用
- **Client Components** - インタラクションが必要な場合のみ
- **Suspense** - ローディング状態管理
- **Error Boundaries** - エラー処理

### パフォーマンス
- **画像最適化** - Next.js Imageコンポーネント使用
- **バンドル最適化** - 動的インポート活用
- **キャッシュ** - Redis + Next.js ISR
- **Core Web Vitals** - 継続的な監視

## 品質管理

### Linting & Formatting
```bash
# ESLint実行
npm run lint

# 型チェック（必要に応じて追加設定）
npx tsc --noEmit
```

### テスト戦略
- **単体テスト** - 重要なユーティリティ関数
- **コンポーネントテスト** - 複雑なコンポーネント
- **E2Eテスト** - 主要なユーザーフロー
- **アクセシビリティテスト** - 全ページで実施

### レビュー基準
1. **型安全性** - TypeScriptエラーがないこと
2. **アクセシビリティ** - WCAG 2.1 AA準拠
3. **パフォーマンス** - Lighthouse スコア90以上
4. **レスポンシブ** - モバイル・デスクトップ対応
5. **SEO** - メタデータ・構造化データ適切
6. **エラーハンドリング** - 適切なエラー処理実装

## 運用・デプロイ

### 環境
- **Development** - `npm run dev`
- **Production** - Vercel でホスティング
- **データ同期** - cron jobでNotion/Supabase同期

### 環境変数
```bash
# Notion
NOTION_API_KEY=
NOTION_DATABASE_ID=

# Supabase  
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# UI制御
NEXT_PUBLIC_SHOW_HEADER=true
```

### データ同期スクリプト
```bash
# ブログデータ同期
npm run fetch:blogs

# イベントデータ同期  
npm run fetch:events
```

## 注意事項

### セキュリティ
- **API Keys** - 環境変数で管理、commit禁止
- **CORS** - 適切なオリジン設定
- **データ検証** - Zodによる入力検証

### アクセシビリティ（重要度：最高）
このプロジェクトは電動車椅子サッカー（障害者スポーツ）のサイトとして、アクセシビリティを最優先事項として位置づけています。

#### 必須遵守事項
- **WCAG 2.1 AA準拠** - 全ページで厳格に遵守
- **shadcn/ui採用理由** - Radix UIベースでアクセシビリティが標準実装済み
- **キーボードナビゲーション** - 全機能をキーボードのみで操作可能
- **スクリーンリーダー対応** - 適切なセマンティックHTML、ARIAラベル使用
- **カラーコントラスト** - 最低4.5:1の比率を維持
- **フォーカス管理** - 明確なフォーカスインジケーター
- **拡大縮小対応** - 200%までの拡大でレイアウト破綻なし

#### 実装時の注意点
- **機能追加時は必ずアクセシビリティチェック実施**
- **shadcn/uiコンポーネントの標準動作を維持**
- **カスタマイズ時もアクセシビリティ機能を損なわない**

### パフォーマンス
- **画像最適化** - WebP形式推奨
- **バンドルサイズ** - 不要なライブラリ除去
- **レンダリング** - SSG/ISR活用
- **メモリリーク** - useEffect cleanup実装

このガイドラインに従って、保守性が高く、ユーザビリティに優れたアプリケーションの開発を進めてください。