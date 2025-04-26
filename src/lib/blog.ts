import {cache} from 'react';
import {BlogCategoryName, BLOG_CATEGORIES} from './constants'

export type BlogItem = {
    id: string
    title: string
    slug: number
    summary: string
    cover: string
    category: string[]
    publishedAt: string
    featured: boolean
    isNew: boolean
    status: string
}

export type NotionBlock = {
    id: string
    type: string
    [key: string]: any
}

export type BlogDetail = {
    blocks: NotionBlock[]
    title: string
    summary: string
    detail: string
    cover: string
    category: string[]
    publishedAt: string
    status?: string
    isNew?: boolean
    featured?: boolean
}

// export const fetchBlogList = cache(async (): Promise<BlogItem[]> => {
export async function fetchBlogList(): Promise<BlogItem[]> {
    try {
        const baseUrl = `${process.env.API_BASE_URL}`;
        console.log('ブログ一覧取得API baseURL:', baseUrl);
        const url = `${baseUrl}/api/blog`;
        console.log('ブログ一覧取得API URL:', url);
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            cache: 'no-store',
            next: {tags: ['blog-list']}
        });
        console.log('レスポンス status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API応答エラー:', res.status, errorText);
            throw new Error('ブログ一覧の取得に失敗しました');
        }

        const data = await res.json();
        console.log('取得したブログ記事数:', data.items?.length || 0);

        if (data.items && data.items.length > 0) {
            const validCategoryNames = BLOG_CATEGORIES.map(cat => cat.name);
            console.log('有効なカテゴリー名:', validCategoryNames);

            data.items.forEach((item: any, index: number) => {
                if (item.category) {
                    console.log(`記事[${index}] ID:${item.id} カテゴリ:`, item.category);

                    if (!Array.isArray(item.category)) {
                        console.warn(`記事ID:${item.id}のカテゴリが配列ではありません`, item.category);
                        item.category = [];
                    }
                } else {
                    console.warn(`記事ID:${item.id}にカテゴリがありません`);
                    item.category = [];
                }
            });
        }

        return data.items;
    } catch (error) {
        console.error('ブログの取得エラー:', error);
        return [];
    }
}

export const fetchBlogDetail = cache(async (slug: string): Promise<BlogDetail> => {
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/api/blog/${slug}`, {
            method: 'GET',
            next: {tags: [`blog-detail-${slug}`]}
        });

        if (!res.ok) throw new Error('ブログ詳細の取得に失敗しました');

        return await res.json();
    } catch (error) {
        console.error('ブログ詳細の取得エラー:', error);
        return {blocks: [], title: '', summary: '', cover: '', category: [], publishedAt: '', detail: ''};
    }
});