'use server'
import { cache } from 'react';
import { BlogCategoryName } from './constants'

export type BlogItem = {
    id: string
    title: string
    slug: string
    summary: string
    cover: string
    category: BlogCategoryName[]
    publishedAt: string
    featured: boolean
    isNew: boolean
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
    cover: string
    category: BlogCategoryName[]
    publishedAt: string
}

export const fetchBlogList = cache(async (): Promise<BlogItem[]> => {
    try {
        console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`, {
            method: 'GET',
            next: { tags: ['blog-list'] }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('API応答エラー:', res.status, errorText);
            throw new Error('ブログ一覧の取得に失敗しました');
        }
        
        const data = await res.json();
        console.log('取得したブログ記事数:', data.items?.length || 0);
        return data.items;
    } catch (error) {
        console.error('ブログの取得エラー:', error);
        return [];
    }
});

export const fetchBlogDetail = cache(async (slug: string): Promise<BlogDetail> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${slug}`, {
            method: 'GET',
            next: { tags: [`blog-detail-${slug}`] }
        });
        
        if (!res.ok) throw new Error('ブログ詳細の取得に失敗しました');
        
        return await res.json();
    } catch (error) {
        console.error('ブログ詳細の取得エラー:', error);
        return { blocks: [], title: '', summary: '', cover: '', category: [], publishedAt: '' };
    }
}); 