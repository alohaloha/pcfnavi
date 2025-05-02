// app/api/event/[id]/route.ts
import { kv } from '@/lib/kvClient';
import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const {id} = await context.params;

    try {
        // 一覧から対象のイベント情報を取得
        const rawList = await kv.get<string>('event');
        if (!rawList) return [];

        let list: any[];
        try {
            list = Array.isArray(rawList) ? rawList : JSON.parse(rawList);
        } catch (error) {
            console.error('JSON parsing error:', error, 'rawList list:', rawList);
            throw new Error("FAQ一覧の取得に失敗しました: JSON形式が不正です");
        }

        const page = list.find(item => item.id === id);
        console.log('page:', page);
        if (!page) {
            return NextResponse.json({ error: 'event not found' }, { status: 404 });
        }
        const properties = (page as any).properties;
        // blocks も取得
        const rawBlocks = await kv.get<string>('event:block');
        if (!rawBlocks) {
            return NextResponse.json({ error: 'event:block not found' }, { status: 404 });
        }

        let blocks: any[];
        let allBlocks;

        try {
            allBlocks = typeof rawBlocks === 'string' ? JSON.parse(rawBlocks) : rawBlocks;
            blocks = Array.isArray(allBlocks) ? allBlocks : [];
        } catch (error) {
            console.error('JSON parsing error:', error, 'rawBlocks:', rawBlocks);
            throw new Error("FAQ一覧の取得に失敗しました: JSON形式が不正です");
        }
        const blockEntry = blocks.find(item => item.id === id);
        console.log('blockEntry:', blockEntry);

        // プロパティ整形（EventItem形式）
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
