# イベント機能実装プロンプト

## 目的
NotionデータベースをCMSとして利用し、イベント情報を管理・表示する機能を実装します。

## 実装要件

### 1. Notionデータベース設計
以下のプロパティを持つデータベースを作成してください：
- title (タイトル): タイトル型
- id (URL用識別子): リッチテキスト型
- summary (概要): リッチテキスト型
- detail (詳細): リッチテキスト型
- eventDate (開催日): 日付型
- location (開催場所): リッチテキスト型
- capacity (定員): 数値型
- price (料金): 数値型
  - 0の場合は「無料」と表示
  - 数値の場合は「¥1,000」のようにフォーマット
- organizer (主催者): リッチテキスト型
- source (掲載元): url型
  - 掲載元のURL等も含む
- status (状態): セレクト型
  - 募集中（wanted）
  - 募集締切（deadline）
  - 開催済み（held）
  - 中止（suspension）
  - 不明（unknown）
- category (カテゴリ): マルチセレクト型
  - 体験（experience）
  - イベント（event）
  - 大会（tournament）
  - 練習（practice）
- cover (カバー画像): ファイル型
- featured (注目): チェックボックス型
- pinned（先頭に固定）：チェックボックス型
- isNew (新着): 数式型（作成日から7日以内）

### 2. API実装要件
1. イベント一覧取得API
   - ステータスによるフィルタリング
   - カテゴリによるフィルタリング
   - 開催日による並び替え
   - ページネーション対応
   - Vercelプレビュー環境対応
     - `VERCEL_AUTOMATION_BYPASS_SECRET`の実装
     - プレビュー環境での認証バイパス処理

2. イベント詳細取得API
   - idによる個別イベント情報の取得（idはpropatiesではなく直下のidを使用）
   - Notionブロックの取得と変換
   - キャッシュ制御（30分）
   - Vercelプレビュー環境対応
     - `VERCEL_AUTOMATION_BYPASS_SECRET`の実装
     - プレビュー環境での認証バイパス処理

### 3. フロントエンド実装要件
1. イベント一覧ページ
   - カード形式でのイベント表示
   - イベントカードクリック時のモーダル表示
     - `@/components/ui/dialog`を使用
     - アニメーション効果の実装（Framer Motion）
     - モーダル内でのイベント詳細表示
     - URLパラメータとの連動（シェア可能なURL）
   - フィルター機能
     - ステータス
     - カテゴリ
     - 料金（無料/有料）
   - ページネーション
   - レスポンシブデザイン

2. イベントモーダル
   - イベント情報の詳細表示
     - タイトル
     - 開催日時
     - 場所
     - 料金
     - 主催者
     - 掲載元（リンク付き）
     - 定員
   - 開催状況に応じたステータス表示
   - 関連イベントの表示
   - SNSシェアボタン
   - モーダルを閉じても状態が保持されるように実装

### 4. 共通実装要件
- TypeScriptでの型定義
- エラーハンドリング
- ローディング状態の表示
- SEO対策
- アクセシビリティ対応

## 技術スタック
- Next.js (App Router)
- TypeScript
- Notion API
- TailwindCSS
- shadcn/ui
  - Dialog（モーダル実装）
- Framer Motion（アニメーション）
- Zustand（状態管理）

## 実装手順
1. Notionデータベースのセットアップ
2. API実装
3. 型定義の作成
4. UI実装
5. 最適化とテスト

## 注意点
- セキュリティを考慮した実装
- パフォーマンスの最適化
- ユーザビリティの向上
- メンテナンス性の確保

## 参考実装
ブログ機能の実装を参考に、同様のアーキテクチャで実装を進めてください。

## 将来の拡張性を考慮した設計
1. データ構造
   - 並び替えに対応可能なデータ構造の採用
   - ソート用のインデックス設計

2. コンポーネント設計
   - 並び替え機能を後から追加しやすい構成
   - 以下の並び替えオプションを想定
     - 開催日順
     - 新着順
     - 料金順

3. API設計
   - クエリパラメータでのソート対応
   - Notionデータベースのソート機能活用 

### 実装例（APIクライアント）
```typescript
export const fetchEventList = cache(async (): Promise<EventItem[]> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${process.env.API_BASE_URL}/api/event`, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: ['event-list']}
        });
        // ... 以降の処理
    } catch (error) {
        console.error('Error fetching event list:', error);
        throw error;
    }
});

export const fetchEventDetail = cache(async (id: string): Promise<EventDetail> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${process.env.API_BASE_URL}/api/event/${id}`, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: [`event-detail-${id}`]}
        });
        // ... 以降の処理
    } catch (error) {
        console.error('Error fetching event detail:', error);
        throw error;
    }
});
```

## 環境変数設定
```env
# Vercelプレビュー環境用の認証バイパス
VERCEL_AUTOMATION_BYPASS_SECRET=

# API設定
API_BASE_URL=
NOTION_API_SECRET=
NOTION_VERSION=
NOTION_EVENT_DB_ID=
``` 