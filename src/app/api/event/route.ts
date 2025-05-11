import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kvClient';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { safeParseJson } from '@/lib/utils/safeParseJson';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || String(ITEMS_PER_PAGE));
        const status = searchParams.get('status') || '';
        const categories = searchParams.getAll('category');
        const isFree = searchParams.get('isFree');


        const raw = await kv.get('event');
        const data = safeParseJson<any[]>(raw, 'event');

        if (!data) {
            return NextResponse.json({ items: [] });
        }


        // KV内データをマッピング（Notionプロパティを整形）
        const items = data.map((row: any) => ({
            id: row.id,
            title: row.properties.title?.title?.[0]?.plain_text || '',
            summary: row.properties.summary?.rich_text?.[0]?.plain_text || '',
            eventDate: row.properties.eventDate?.date || {},
            location: row.properties.location?.rich_text?.[0]?.plain_text || '',
            capacity: row.properties.capacity?.number || 0,
            price: row.properties.price?.number ?? null,
            organizer: row.properties.organizer?.rich_text?.[0]?.plain_text || '',
            source: row.properties.source?.url || '',
            status: row.properties.status?.select?.name || '',
            category: row.properties.category?.multi_select?.map((c: any) => c.name) || [],
            cover: row.properties.cover?.files?.[0]?.file?.url ||
                row.properties.cover?.files?.[0]?.external?.url || '',
            featured: row.properties.featured?.checkbox || false,
            pinned: row.properties.pinned?.checkbox || false,
            isNew: row.properties.isNew?.formula?.boolean || false,
        })).filter(event => event.title);

        // フィルター
        const filtered = items.filter((item) => {
            if (status && item.status !== status) return false;
            if (categories.length > 0 && !categories.every(cat => item.category.includes(cat))) return false;
            if (isFree === 'true' && item.price > 0) return false;
            if (isFree === 'false' && item.price === 0) return false;
            return true;
        });

        const total = filtered.length;
        const offset = (page - 1) * pageSize;
        const paginated = filtered.slice(offset, offset + pageSize);

        return NextResponse.json({
            items: paginated,
            total,
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error('KV版 イベント一覧取得失敗:', error);
        return NextResponse.json({ error: 'イベント一覧の取得に失敗しました' }, { status: 500 });
    }
}
