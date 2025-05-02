// app/api/blog/route.ts
import { kv } from '@/lib/kvClient';
import { NextResponse } from 'next/server';
import { safeParseJson } from '@/lib/utils/safeParseJson';

export async function GET() {
    try {
        const raw = await kv.get('blog');
        const data = safeParseJson<any[]>(raw, 'blog');

        if (!data) {
            return NextResponse.json({ items: [] });
        }

        const items = data.map((row: any) => {
            const properties = row.properties;

            return {
                id: row.id,
                title: properties.title?.title?.[0]?.plain_text || '',
                summary: properties.summary?.rich_text?.[0]?.plain_text || '',
                cover: properties.cover?.files?.[0]?.file?.url ||
                    properties.cover?.files?.[0]?.external?.url || '',
                category: properties.category?.multi_select?.map((item: any) => item.name) || [],
                publishedAt: properties.publishedAt?.date?.start || '',
                featured: properties.featured?.checkbox || false,
                isNew: properties.isNew?.formula?.boolean || false,
                status: properties.status?.select?.name || '',
            };
        }).filter(item => item.title && item.status === 'published');

        // 既に Notion 側でソート済み or KV に格納済みの順を維持するなら sort 不要
        return NextResponse.json({ items });
    } catch (error) {
        console.error('ブログ一覧の取得に失敗しました', error);
        return NextResponse.json({ error: 'ブログ一覧の取得に失敗しました' }, { status: 500 });
    }
}
