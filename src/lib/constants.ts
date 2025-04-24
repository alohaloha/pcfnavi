// サイト全般
export const SITE_NAME = 'PCF NAVI'
export const SITE_DESCRIPTION = '電動車椅子サッカーの情報ポータル'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

// ナビゲーション
export const NAVIGATION_ITEMS = [
    {name: 'ホーム', path: '/'},
    {name: 'ルール', path: '/rules'},
    {name: 'イベント', path: '/events'},
    {name: 'ギャラリー', path: '/gallery'},
    {name: '記事', path: '/posts'},
    {name: 'よくある質問', path: '/faq'},
    {name: '私たちについて', path: '/about'}
]

// FAQカテゴリー
export const FAQ_CATEGORIES = [
    {name: '一般', path: 'general'},
    {name: 'ルール', path: 'rules'},
    {name: 'イベント', path: 'events'},
    {name: '大会', path: 'competitions'},
    {name: 'チーム', path: 'teams'},
    {name: '体験', path: 'experience'},
    {name: 'サポート', path: 'support'},
    {name: '教育', path: 'education'},
    {name: '普及', path: 'promotion'},
    {name: '医療', path: 'medical'},
    {name: '費用', path: 'costs'},
    {name: '機材', path: 'equipment'},
    {name: 'その他', path: 'other'}
] as const

// BLOGカテゴリー
export const BLOG_CATEGORIES = [
    {name: 'ルール', key: 'rules'},
    {name: 'イベント', key: 'events'},
    {name: '大会', key: 'competitions'},
    {name: '体験', key: 'experience'},
    {name: '教育', key: 'education'},
    {name: '普及', key: 'promotion'},
    {name: 'コラボ', key: 'collaboration'},
    {name: '日本代表', key: 'alljapan'},
    {name: 'その他', key: 'other'}
] as const

export type FaqCategoryName = typeof FAQ_CATEGORIES[number]['name']
export type FaqCategoryPath = typeof FAQ_CATEGORIES[number]['path']
export type BlogCategoryName = typeof BLOG_CATEGORIES[number]['name']
export type BlogCategoryKey = typeof BLOG_CATEGORIES[number]['key']

// API関連
export const API_CONFIG = {
    NOTION_API_URL: 'https://api.notion.com/v1',
    NOTION_VERSION: '2022-06-28',
    NOTION_API_SECRET: process.env.NOTION_API_SECRET,
    NOTION_FAQ_DB_ID: process.env.NOTION_FAQ_DB_ID,
    NOTION_BLOG_DB_ID: process.env.NOTION_BLOG_DB_ID,
}

// 表示関連
export const ITEMS_PER_PAGE = 10
