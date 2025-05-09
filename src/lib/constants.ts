// サイト全般
export const SITE_NAME = '電くるなび'
export const SITE_DESCRIPTION = '電動車椅子サッカーの情報ポータル'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

// ナビゲーション
export const Navigation = {
    Home: {
        name: 'ホーム',
        path: '/',
    },
    Rules: {
        name: 'ルール',
        path: '/rules',
    },
    Events: {
        name: 'イベント',
        path: '/event',
    },
    Gallery: {
        name: 'ギャラリー',
        path: '/gallery',
    },
    Posts: {
        name: '記事',
        path: '/posts',
    },
    FAQ: {
        name: 'よくある質問',
        path: '/faq',
    },
    About: {
        name: '私たちについて',
        path: '/about',
    },
} as const;
export type NavigationType = (typeof Navigation)[keyof typeof Navigation];

export const NavigationArray: readonly NavigationType[] = [
    Navigation.Home,
    Navigation.Rules,
    Navigation.Events,
    Navigation.Gallery,
    Navigation.Posts,
    Navigation.FAQ,
    Navigation.About,
] as const;

export const NavigationMap: { [path: string]: NavigationType } = {
    [Navigation.Home.path]: Navigation.Home,
    [Navigation.Rules.path]: Navigation.Rules,
    [Navigation.Events.path]: Navigation.Events,
    [Navigation.Gallery.path]: Navigation.Gallery,
    [Navigation.Posts.path]: Navigation.Posts,
    [Navigation.FAQ.path]: Navigation.FAQ,
    [Navigation.About.path]: Navigation.About,
} as const;

// FAQカテゴリー
export const FaqCategory = {
    General: {
        name: '一般',
        path: 'general',
    },
    Rules: {
        name: 'ルール',
        path: 'rules',
    },
    Events: {
        name: 'イベント',
        path: 'events',
    },
    Competitions: {
        name: '大会',
        path: 'competitions',
    },
    Teams: {
        name: 'チーム',
        path: 'teams',
    },
    Experience: {
        name: '体験',
        path: 'experience',
    },
    Support: {
        name: 'サポート',
        path: 'support',
    },
    Education: {
        name: '教育',
        path: 'education',
    },
    Promotion: {
        name: '普及',
        path: 'promotion',
    },
    Medical: {
        name: '医療',
        path: 'medical',
    },
    Costs: {
        name: '費用',
        path: 'costs',
    },
    Equipment: {
        name: '機材',
        path: 'equipment',
    },
    Other: {
        name: 'その他',
        path: 'other',
    },
} as const;
export type FaqCategoryType = (typeof FaqCategory)[keyof typeof FaqCategory];

export const FaqCategoryArray: readonly FaqCategoryType[] = [
    FaqCategory.General,
    FaqCategory.Rules,
    FaqCategory.Events,
    FaqCategory.Competitions,
    FaqCategory.Teams,
    FaqCategory.Experience,
    FaqCategory.Support,
    FaqCategory.Education,
    FaqCategory.Promotion,
    FaqCategory.Medical,
    FaqCategory.Costs,
    FaqCategory.Equipment,
    FaqCategory.Other,
] as const;

export const FaqCategoryMap: { [path: string]: FaqCategoryType } = {
    [FaqCategory.General.path]: FaqCategory.General,
    [FaqCategory.Rules.path]: FaqCategory.Rules,
    [FaqCategory.Events.path]: FaqCategory.Events,
    [FaqCategory.Competitions.path]: FaqCategory.Competitions,
    [FaqCategory.Teams.path]: FaqCategory.Teams,
    [FaqCategory.Experience.path]: FaqCategory.Experience,
    [FaqCategory.Support.path]: FaqCategory.Support,
    [FaqCategory.Education.path]: FaqCategory.Education,
    [FaqCategory.Promotion.path]: FaqCategory.Promotion,
    [FaqCategory.Medical.path]: FaqCategory.Medical,
    [FaqCategory.Costs.path]: FaqCategory.Costs,
    [FaqCategory.Equipment.path]: FaqCategory.Equipment,
    [FaqCategory.Other.path]: FaqCategory.Other,
} as const;

// BLOGカテゴリー
export const BlogCategory = {
    Rules: {
        name: 'ルール',
        key: 'rules',
    },
    Events: {
        name: 'イベント',
        key: 'events',
    },
    Competitions: {
        name: '大会',
        key: 'competitions',
    },
    Experience: {
        name: '体験',
        key: 'experience',
    },
    Education: {
        name: '教育',
        key: 'education',
    },
    Promotion: {
        name: '普及',
        key: 'promotion',
    },
    Collaboration: {
        name: 'コラボ',
        key: 'collaboration',
    },
    AllJapan: {
        name: '日本代表',
        key: 'alljapan',
    },
    World: {
        name: '世界',
        key: 'world',
    },
    Other: {
        name: 'その他',
        key: 'other',
    },
} as const;
export type BlogCategoryType = (typeof BlogCategory)[keyof typeof BlogCategory];

export const BlogCategoryArray: readonly BlogCategoryType[] = [
    BlogCategory.Rules,
    BlogCategory.Events,
    BlogCategory.Competitions,
    BlogCategory.Experience,
    BlogCategory.Education,
    BlogCategory.Promotion,
    BlogCategory.Collaboration,
    BlogCategory.AllJapan,
    BlogCategory.World,
    BlogCategory.Other,
] as const;

export const BlogCategoryMap: { [key: string]: BlogCategoryType } = {
    [BlogCategory.Rules.key]: BlogCategory.Rules,
    [BlogCategory.Events.key]: BlogCategory.Events,
    [BlogCategory.Competitions.key]: BlogCategory.Competitions,
    [BlogCategory.Experience.key]: BlogCategory.Experience,
    [BlogCategory.Education.key]: BlogCategory.Education,
    [BlogCategory.Promotion.key]: BlogCategory.Promotion,
    [BlogCategory.Collaboration.key]: BlogCategory.Collaboration,
    [BlogCategory.AllJapan.key]: BlogCategory.AllJapan,
    [BlogCategory.World.key]: BlogCategory.World,
    [BlogCategory.Other.key]: BlogCategory.Other,
} as const;

// EVENTカテゴリー
export const EventCategory = {
    Experience: {
        name: '体験',
        key: 'experience',
    },
    Event: {
        name: 'イベント',
        key: 'event',
    },
    Tournament: {
        name: '大会',
        key: 'tournament',
    },
    Practice: {
        name: '練習',
        key: 'practice',
    },
    Domestic: {
        name: '国内',
        key: 'domestic',
    },
    International: {
        name: '国際',
        key: 'international',
    },
    AllJapan: {
        name: '日本代表',

        key: 'allJapan',
    },
} as const;
export type EventCategoryType = (typeof EventCategory)[keyof typeof EventCategory];

export const EventCategoryArray: readonly EventCategoryType[] = [
    EventCategory.Experience,
    EventCategory.Event,
    EventCategory.Tournament,
    EventCategory.Practice,
    EventCategory.Domestic,
    EventCategory.International,
    EventCategory.AllJapan,
] as const;

export const EventCategoryMap: { [key: string]: EventCategoryType } = {
    [EventCategory.Experience.key]: EventCategory.Experience,
    [EventCategory.Event.key]: EventCategory.Event,
    [EventCategory.Tournament.key]: EventCategory.Tournament,
    [EventCategory.Practice.key]: EventCategory.Practice,
    [EventCategory.Domestic.key]: EventCategory.Domestic,
    [EventCategory.International.key]: EventCategory.International,
    [EventCategory.AllJapan.key]: EventCategory.AllJapan,
} as const;

// EVENTステータス
export const EventStatus = {
    Wanted: {
        name: '募集中',
        key: 'wanted',
    },
    Deadline: {
        name: '募集締切',
        key: 'deadline',
    },
    Scheduled: {
        name: '開催予定',
        key: 'scheduled',
    },
    Held: {
        name: '開催済み',
        key: 'held',
    },
    Suspension: {
        name: '中止',
        key: 'suspension',
    },
    Unknown: {
        name: '不明',
        key: 'unknown',
    },
} as const;
export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];

export const EventStatusArray: readonly EventStatusType[] = [
    EventStatus.Wanted,
    EventStatus.Deadline,
    EventStatus.Scheduled,
    EventStatus.Held,
    EventStatus.Suspension,
    EventStatus.Unknown,
] as const;

export const EventStatusMap: { [key: string]: EventStatusType } = {
    [EventStatus.Wanted.key]: EventStatus.Wanted,
    [EventStatus.Deadline.key]: EventStatus.Deadline,
    [EventStatus.Scheduled.key]: EventStatus.Scheduled,
    [EventStatus.Held.key]: EventStatus.Held,
    [EventStatus.Suspension.key]: EventStatus.Suspension,
    [EventStatus.Unknown.key]: EventStatus.Unknown,
} as const;

// FAQ カテゴリー
export type FaqCategoryName = FaqCategoryType['name'];
export type FaqCategoryPath = FaqCategoryType['path'];

// BLOG カテゴリー
export type BlogCategoryName = BlogCategoryType['name'];
export type BlogCategoryKey = BlogCategoryType['key'];

// EVENT カテゴリー
export type EventCategoryName = EventCategoryType['name'];
export type EventCategoryKey = EventCategoryType['key'];

// EVENT ステータス
export type EventStatusName = EventStatusType['name'];
export type EventStatusKey = EventStatusType['key'];

// API関連
export const API_CONFIG = {
    NOTION_API_URL: 'https://api.notion.com/v1',
    NOTION_VERSION: '2022-06-28',
    NOTION_API_SECRET: process.env.NOTION_API_SECRET,
    NOTION_FAQ_DB_ID: process.env.NOTION_FAQ_DB_ID,
    NOTION_BLOG_DB_ID: process.env.NOTION_BLOG_DB_ID,
    NOTION_EVENT_DB_ID: process.env.NOTION_EVENT_DB_ID,
}

// 表示関連
export const ITEMS_PER_PAGE = 10
