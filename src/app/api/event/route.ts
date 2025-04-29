import {NextRequest, NextResponse} from 'next/server';
import {API_CONFIG, ITEMS_PER_PAGE} from '@/lib/constants';
import {notion} from '@/lib/notionClient';

const EVENT_DB_ID = API_CONFIG.NOTION_EVENT_DB_ID!;

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || String(ITEMS_PER_PAGE));
        const status = searchParams.get('status') || 'scheduled';
        const categories = searchParams.getAll('category');
        const isFree = searchParams.get('isFree') || '';

        const filters: any[] = [];

        if (status) {
            filters.push({
                property: 'status',
                select: {equals: status}
            });
        }

        if (categories.length > 0) {
            const categoryFilters = categories.map(category => ({
                property: 'category',
                multi_select: {contains: category}
            }));
            filters.push(categoryFilters.length > 1 ? {and: categoryFilters} : categoryFilters[0]);
        }

        if (isFree === 'true') {
            filters.push({
                property: 'price',
                number: {equals: 0}
            });
        } else if (isFree === 'false') {
            filters.push({
                property: 'price',
                number: {greater_than: 0}
            });
        }

        const notionResponse = await notion.databases.query({
            database_id: EVENT_DB_ID,
            filter: filters.length > 0 ? {and: filters} : undefined,
            sorts: [{property: 'eventDate', direction: 'ascending'}],
            page_size: pageSize,
        });

        const items = notionResponse.results.map((row: any) => ({
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
            category: row.properties.category?.multi_select?.map((item: any) => item.name) || [],
            cover: row.properties.cover?.files?.[0]?.file?.url ||
                row.properties.cover?.files?.[0]?.external?.url || '',
            featured: row.properties.featured?.checkbox || false,
            pinned: row.properties.pinned?.checkbox || false,
            isNew: row.properties.isNew?.formula?.boolean || false,
        })).filter(item => item.title);

        const totalItems = notionResponse.results.length;
        const pageCount = Math.ceil(totalItems / pageSize);

        return NextResponse.json({
            items,
            total: totalItems,
            page,
            pageSize,
            pageCount
        });
    } catch (error) {
        console.error('イベント一覧の取得に失敗しました', error);
        return NextResponse.json({error: 'イベント一覧の取得に失敗しました'}, {status: 500});
    }
}
