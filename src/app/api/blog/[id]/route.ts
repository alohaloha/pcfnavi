// app/api/blog/[id]/route.ts
import { kv } from '@/lib/kvClient';
import { NextResponse } from 'next/server';
import { safeParseJson } from '@/lib/utils/safeParseJson';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        // 一覧から対象の blog ページを探す
        const rawList = await kv.get('blog');
        const list = safeParseJson<any[]>(rawList, 'blog');

        if (!list) {
            return NextResponse.json({ error: 'blog not found in KV' }, { status: 404 });
        }

        const page = list.find(item => item.id === id);
        if (!page) {
            return NextResponse.json({ error: 'blog not found' }, { status: 404 });
        }

        const properties = page.properties;

        // blocks の取得
        const rawBlocks = await kv.get('blog:block');
        const blocksList = safeParseJson<{ id: string; blocks: any[] }[]>(rawBlocks, 'blog:block');
        const blockEntry = blocksList?.find(item => item.id === id);

        // 整形して返却
        const categories = properties.category?.multi_select?.map((item: any) => item.name) || [];

        return NextResponse.json({
            id: page.id,
            title: properties.title?.title?.[0]?.plain_text || '',
            summary: properties.summary?.rich_text?.[0]?.plain_text || '',
            detail: properties.detail?.rich_text?.[0]?.plain_text || '',
            cover: properties.cover?.files?.[0]?.file?.url ||
                properties.cover?.files?.[0]?.external?.url || '',
            category: categories,
            publishedAt: properties.publishedAt?.date?.start || '',
            featured: properties.featured?.checkbox || false,
            isNew: properties.isNew?.formula?.boolean || false,
            blocks: blockEntry?.blocks || [],
        });
    } catch (error) {
        console.error('ブログ詳細の取得に失敗しました:', error);
        return NextResponse.json({ error: 'ブログ詳細の取得に失敗しました' }, { status: 500 });
    }
}
