// app/api/event/[id]/route.ts
import { kv } from '@/lib/kvClient';
import { NextResponse } from 'next/server';
import { safeParseJson } from '@/lib/utils/safeParseJson';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        // 一覧データ取得（KV: event）
        const rawList = await kv.get('event');
        const list = safeParseJson<any[]>(rawList, 'event');

        if (!list) {
            return NextResponse.json({ error: 'event not found in KV' }, { status: 404 });
        }

        const page = list.find(item => item.id === id);
        if (!page) {
            return NextResponse.json({ error: 'event not found' }, { status: 404 });
        }

        const properties = page.properties;

        // ブロック取得（KV: event:block）
        const rawBlocks = await kv.get('event:block');
        const allBlocks = safeParseJson<{ id: string; blocks: any[] }[]>(rawBlocks, 'event:block');

        const blockEntry = allBlocks?.find(item => item.id === id);

        // 整形
        const event = {
            id: page.id,
            title: properties.title?.title?.[0]?.plain_text || '',
            summary: properties.summary?.rich_text?.[0]?.plain_text || '',
            detail: properties.detail?.rich_text?.[0]?.plain_text || '',
            eventDate: properties.eventDate?.date || {},
            location: properties.location?.rich_text?.[0]?.plain_text || '',
            capacity: properties.capacity?.number || 0,
            price: properties.price?.number ?? null,
            organizer: properties.organizer?.rich_text?.[0]?.plain_text || '',
            source: properties.source?.url || '',
            status: properties.status?.select?.name || '',
            category: properties.category?.multi_select?.map((c: any) => c.name) || [],
            cover: properties.cover?.files?.[0]?.file?.url ||
                properties.cover?.files?.[0]?.external?.url || '',
            featured: properties.featured?.checkbox || false,
            pinned: properties.pinned?.checkbox || false,
            isNew: properties.isNew?.formula?.boolean || false,
            applicationUrl: properties.applicationUrl?.url || '',
            blocks: blockEntry?.blocks ?? [],
        };

        return NextResponse.json(event);
    } catch (error) {
        console.error('イベント詳細取得エラー:', error);
        return NextResponse.json({ error: 'イベント詳細の取得に失敗しました' }, { status: 500 });
    }
}
