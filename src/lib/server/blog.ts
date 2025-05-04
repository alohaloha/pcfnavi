'use server'
import {cache} from 'react';
import {BlogCategoryArray} from '../constants'
import {NotionBlock} from "@/types/notion";
import { supabase } from '@/lib/supabaseClient';
import { getCloudflareImageUrl } from '@/lib/cloudflare';

export type BlogItem = {
    id: string
    title: string
    ID: number
    summary: string
    cover: string
    category?: string[] | []
    publishedAt: string
    featured: boolean
    isNew: boolean
    status: string
}

export type BlogDetail = {
    id: string
    blocks?: NotionBlock[] | []
    title: string
    summary: string
    detail: string
    cover: string
    category?: string[] | []
    publishedAt: string
    status?: string
    isNew?: boolean
    featured?: boolean
}

export const fetchBlogList = cache(async (): Promise<BlogItem[]> => {
    try {
        const url = `${process.env.API_BASE_URL}/api/blog`;
        console.log('ブログ一覧取得API URL:', url);
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: ['blog-list'], revalidate: 0}
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API応答エラー:', res.status, errorText);
            throw new Error('ブログ一覧の取得に失敗しました');
        }

        const data = await res.json();
        console.log('取得したブログ記事数:', data.items?.length || 0);

        if (data.items && data.items.length > 0) {
            const validCategoryNames = BlogCategoryArray.map(cat => cat.name);
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
});

export const fetchBlogDetail = cache(async (id: string): Promise<BlogDetail> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${process.env.API_BASE_URL}/api/blog/${id}`, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: [`blog-detail-${id}`]}
        });

        if (!res.ok) throw new Error('ブログ詳細の取得に失敗しました');

        return await res.json();
    } catch (error) {
        console.error('ブログ詳細の取得エラー:', error);
        return {id: '', blocks: [], title: '', summary: '', cover: '', category: [], publishedAt: '', detail: ''};
    }
});


export async function getBlogListFromSupabase(): Promise<BlogItem[]> {
    const { data, error } = await supabase.from('blog_pages').select('*').order('published_at', { ascending: false });

    if (error || !data) {
        console.error('ブログ一覧の取得に失敗しました', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        cover: item.cover ? getCloudflareImageUrl(item.cover) : '',
        category: Array.isArray(item.category) ? item.category : [],
        publishedAt: item.published_at,
        featured: item.featured,
        isNew: false,
        status: item.status || '',
        ID: item.ID || 0,
    }));
}

export async function getBlogDetailFromSupabase(id: string): Promise<BlogDetail | null> {
    const { data: page, error: pageError } = await supabase.from('blog_pages').select('*').eq('id', id).single();
    if (pageError || !page) return null;

    const { data: blocks, error: blockError } = await supabase
        .from('blog_blocks')
        .select('*')
        .eq('page_id', id)
        .order('order', { ascending: true });
    if (blockError) return null;

    const blockIds = blocks?.map(block => block.id) || [];

    const { data: richTexts, error: rtError } = await supabase
        .from('blog_rich_texts')
        .select('*')
        .in('block_id', blockIds)
        .order('order', { ascending: true });
    if (rtError) return null;

    const blocksWithText = blocks?.map(block => ({
        ...block,
        rich_texts: richTexts.filter(rt => rt.block_id === block.id),
    })) ?? [];

    return {
        id: page.id,
        title: page.title,
        summary: page.summary,
        detail: page.detail,
        cover: page.cover ? getCloudflareImageUrl(page.cover) : '',
        category: Array.isArray(page.category) ? page.category : [],
        publishedAt: page.published_at,
        featured: page.featured,
        isNew: false,
        blocks: blocksWithText,
    };
}
