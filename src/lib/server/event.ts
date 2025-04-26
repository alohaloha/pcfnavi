'use server'
import {cache} from 'react';
import {EventDetail, EventFilters, EventItem, EventListResponse} from '@/types/event';

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
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/event?${params.toString()}`;

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