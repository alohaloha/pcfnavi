import {
    EventCategoryMap,
    EventStatusMap,
    BlogCategoryMap,
    FaqCategoryMap
} from './constants';

/**
 * イベントカテゴリのキーから日本語名を取得
 * @param key カテゴリキー
 * @param defaultName 見つからない場合のデフォルト値
 */
export function getEventCategoryName(key: string, defaultName = 'カテゴリ不明'): string {
    return EventCategoryMap[key]?.name || defaultName;
}

/**
 * イベントステータスのキーから日本語名を取得
 * @param key ステータスキー
 * @param defaultName 見つからない場合のデフォルト値
 */
export function getEventStatusName(key: string, defaultName = 'ステータス不明'): string {
    return EventStatusMap[key]?.name || defaultName;
}

/**
 * ブログカテゴリのキーから日本語名を取得
 * @param key カテゴリキー
 * @param defaultName 見つからない場合のデフォルト値
 */
export function getBlogCategoryName(key: string, defaultName = 'カテゴリ不明'): string {
    return BlogCategoryMap[key]?.name || defaultName;
}

/**
 * FAQカテゴリのパスから日本語名を取得
 * @param path カテゴリパス
 * @param defaultName 見つからない場合のデフォルト値
 */
export function getFaqCategoryName(path: string, defaultName = 'カテゴリ不明'): string {
    return FaqCategoryMap[path]?.name || defaultName;
}

/**
 * 汎用的なカテゴリ名取得関数
 * @param key キー値
 * @param categoryMap 使用するカテゴリマップ
 * @param defaultName 見つからない場合のデフォルト値
 */
export function getCategoryName<T extends { name: string }>(
    key: string,
    categoryMap: { [key: string]: T },
    defaultName = '不明'
): string {
    return categoryMap[key]?.name || defaultName;
}