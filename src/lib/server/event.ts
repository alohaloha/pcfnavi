'use server'
import {cache} from 'react';
import {EventDetail, EventFilters, EventItem, EventListResponse} from '@/types/event';
import { NotionBlock } from "@/types/notion";
import { supabase } from '@/lib/supabaseClient';
import { getCloudflareImageUrl } from '@/lib/cloudflare';

/**
 * イベント一覧を取得する
 * @param page ページ番号
 * @param pageSize ページサイズ
 * @param filters フィルター条件
 * @returns イベント一覧
 */
export const fetchEventList = cache(async (
    page: number = 1,
    pageSize: number = 10,
    filters?: EventFilters
): Promise<EventListResponse> => {
    try {
        // クエリパラメータの構築
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        // フィルター条件があれば追加
        if (filters) {
            if (filters.status) params.append('status', filters.status);
            if (filters.category) {
                if (Array.isArray(filters.category)) {
                    filters.category.forEach(cat => params.append('category', cat));
                } else {
                    params.append('category', filters.category);
                }
            }
            if (filters.isFree !== undefined) params.append('isFree', filters.isFree.toString());
        }

        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const url = `${process.env.API_BASE_URL}/api/event?${params.toString()}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: ['event-list']}
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`イベント一覧の取得に失敗しました: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('イベント一覧の取得に失敗しました:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            pageSize,
            pageCount: 0
        };
    }
});

/**
 * イベント詳細を取得する
 * @param id イベントID
 * @returns イベント詳細
 */
export const fetchEventDetail = cache(async (id: string): Promise<EventDetail | null> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const url = `${process.env.API_BASE_URL}/api/event/${id}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {'x-vercel-protection-bypass': protectionBypassSecret}),
            },
            next: {tags: [`event-detail-${id}`]}
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`イベント詳細の取得に失敗しました: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('イベント詳細の取得に失敗しました:', error);
        return null;
    }
});

// キャッシュ付きのイベント一覧取得関数
export const getEventListFromSupabase = cache(async (): Promise<EventItem[]> => {
    const { data, error } = await supabase
        .from('event_pages')
        .select('*')
        .neq('status', null)
        .order('start_at', { ascending: true });

    if (error || !data) {
        console.error('イベント一覧の取得に失敗しました', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        eventDate: {
            start: item.start_at,
            end: item.end_at,
            is_all_day: item.is_all_day
        },
        location: item.location,
        capacity: item.capacity,
        price: item.price,
        organizer: item.organizer,
        source: item.source,
        status: item.status,
        category: Array.isArray(item.category) ? item.category : [],
        cover: item.cover ? getCloudflareImageUrl(item.cover) : '',
        featured: item.featured,
        pinned: item.pinned,
        isNew: false,
        lastEditedTime: item.last_edited_time,
    }));
});

// キャッシュ付きのイベント詳細取得関数
export const getEventDetailFromSupabase = cache(async (id: string): Promise<EventDetail | null> => {
    const { data: page, error: pageError } = await supabase
        .from('event_pages')
        .select('*')
        .eq('id', id)
        .single();
    
    if (pageError || !page) return null;

    const { data: blocks, error: blockError } = await supabase
        .from('event_blocks')
        .select('*')
        .eq('page_id', id)
        .order('order', { ascending: true });
    
    if (blockError) return null;

    const blockIds = blocks?.map(block => block.id) || [];

    const { data: richTexts, error: rtError } = await supabase
        .from('event_rich_texts')
        .select('*')
        .in('block_id', blockIds)
        .order('order', { ascending: true });
    
    if (rtError) return null;

    const blocksWithImage = blocks?.map(block => ({
        ...block,
        imageSrc: block.cloudflare_key ? getCloudflareImageUrl(block.cloudflare_key) : null,
        captionText: block?.captiton_text ? block.caption_text : null,
        captionHtml: block.caption_html ? block.caption_html : null,
    })) ?? [];
    const blocksWithText = blocksWithImage?.map(block => ({
        ...block,
        rich_texts: richTexts.filter(rt => rt.block_id === block.id),
    })) ?? [];

    // 一覧ページと同じ変換処理を適用
    return {
        id: page.id,
        title: page.title,
        summary: page.summary,
        detail: page.detail,
        eventDate: {
            start: page.start_at,
            end: page.end_at,
            is_all_day: page.is_all_day
        },
        location: page.location,
        capacity: page.capacity,
        price: page.price,
        organizer: page.organizer,
        source: page.source,
        status: page.status,
        category: Array.isArray(page.category) ? page.category : [],
        cover: page.cover ? getCloudflareImageUrl(page.cover) : '',
        featured: page.featured,
        pinned: page.pinned,
        isNew: false,
        lastEditedTime: page.last_edited_time,
        blocks: blocksWithText
    };
}); 