'use server'
import {cache} from 'react';
import {FaqCategoryName, FAQ_CATEGORIES} from './constants'

export type FaqItem = {
    id: string
    question: string
    answer: string
    category: FaqCategoryName[]
}

export type NotionBlock = {
    id: string
    type: string
    [key: string]: any
}

export type FaqDetail = {
    blocks: NotionBlock[]
}

export const fetchFaqList = cache(async (): Promise<FaqItem[]> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/faq`, {
            method: 'GET',
            next: {tags: ['faq-list']}
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/faq/detail/${id}`, {
            method: 'GET',
            next: {tags: [`faq-detail-${id}`]}
        });

        if (!res.ok) throw new Error('FAQ詳細の取得に失敗しました');

        return await res.json();
    } catch (error) {
        console.error('FAQ詳細の取得エラー:', error);
        return {blocks: []};
    }
});
