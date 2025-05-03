'use server'
import {cache} from 'react';
import {FaqCategoryName} from '../constants';
import {NotionBlock} from '@/types/notion';

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
    category: FaqCategoryName[];
    show_blocks: boolean;
};

export type FaqDetail = {
    blocks: NotionBlock[];
};

export const fetchFaqList = cache(async (): Promise<FaqItem[]> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${process.env.API_BASE_URL}/api/faq`, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {
                    'x-vercel-protection-bypass': protectionBypassSecret,
                }),
            },
            next: {tags: ['faq-list']},
        });

        if (!res.ok) throw new Error('FAQ一覧の取得に失敗しました');

        const data = await res.json();
        return data.items;
    } catch (error) {
        console.error('FAQの取得エラー:', error);
        return [];
    }
});

export const fetchFaqDetail = cache(async (id: string): Promise<FaqDetail> => {
    try {
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const res = await fetch(`${process.env.API_BASE_URL}/api/faq/${id}`, {
            method: 'GET',
            headers: {
                ...(protectionBypassSecret && {
                    'x-vercel-protection-bypass': protectionBypassSecret,
                }),
            },
            next: {tags: [`faq-detail-${id}`]},
        });

        if (!res.ok) throw new Error('FAQ詳細の取得に失敗しました');

        return await res.json();
    } catch (error) {
        console.error('FAQ詳細の取得エラー:', error);
        return {blocks: []};
    }
});
