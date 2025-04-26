import {NextRequest, NextResponse} from 'next/server';
import {API_CONFIG, ITEMS_PER_PAGE} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const EVENT_DB_ID = API_CONFIG.NOTION_EVENT_DB_ID!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;

export async function GET(request: NextRequest) {
    try {
        // URLからクエリパラメータを取得
        const {searchParams} = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || String(ITEMS_PER_PAGE));
        const status = searchParams.get('status') || '';
        const category = searchParams.get('category') || '';
        const isFree = searchParams.get('isFree') || '';

        // フィルターの作成
        const filters: any[] = [];

        // ステータスフィルター
        if (status) {
            filters.push({
                property: 'status',
                select: {
                    equals: status
                }
            });
        }

        // カテゴリフィルター
        if (category) {
            filters.push({
                property: 'category',
                multi_select: {
                    contains: category
                }
            });
        }

        // 料金フィルター（無料/有料）
        if (isFree === 'true') {
            filters.push({
                property: 'price',
                number: {
                    equals: 0
                }
            });
        } else if (isFree === 'false') {
            filters.push({
                property: 'price',
                number: {
                    greater_than: 0
                }
            });
        }

        // Notionフィルター設定
        const filterConfig = filters.length > 0
            ? {
                and: filters
            }
            : undefined;

        // Notion APIリクエスト設定
        const requestBody: any = {
            sorts: [
                {
                    property: 'eventDate',
                    direction: 'ascending'
                }
            ],
            page_size: pageSize,
            start_cursor: page > 1 ? (page - 1) * pageSize : undefined
        };

        // フィルターがある場合はリクエストに追加
        if (filterConfig) {
            requestBody.filter = filterConfig;
        }

        // Vercelプレビュー環境のバイパストークンの取得
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const headers: HeadersInit = {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': API_VERSION,
            'Content-Type': 'application/json',
        };

        // プレビュー環境のバイパストークンがある場合はヘッダーに追加
        if (protectionBypassSecret) {
            headers['x-vercel-protection-bypass'] = protectionBypassSecret;
        }

        // Notion APIへのリクエスト
        const res = await fetch(`${NOTION_URL}/databases/${EVENT_DB_ID}/query`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
            next: {revalidate: 1800} // 30分キャッシュ
        });

        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Notion API error: ${res.status} - ${errorData}`);
        }

        const data = await res.json();
        console.log('取得したイベント数:', data.results.length);

        // レスポンスデータの整形
        const items = data.results.map((row: any) => {
            try {
                // カテゴリの抽出処理
                const categoryProp = row.properties.category;
                const categories = categoryProp?.multi_select?.map((item: any) => item.name) || [];
                console.log('eventDate:', row.properties.eventDate);
                console.log('status:', row.properties.status);

                return {
                    id: row.id,
                    title: row.properties.title?.title?.[0]?.plain_text || '',
                    summary: row.properties.summary?.rich_text?.[0]?.plain_text || '',
                    eventDate: row.properties.eventDate?.date?.start || '',
                    location: row.properties.location?.rich_text?.[0]?.plain_text || '',
                    capacity: row.properties.capacity?.number || 0,
                    price: row.properties.price?.number || 0,
                    organizer: row.properties.organizer?.rich_text?.[0]?.plain_text || '',
                    source: row.properties.source?.url || '',
                    status: row.properties.status?.select?.name || '',
                    category: categories,
                    cover: row.properties.cover?.files?.[0]?.file?.url ||
                        row.properties.cover?.files?.[0]?.external?.url || '',
                    featured: row.properties.featured?.checkbox || false,
                    pinned: row.properties.pinned?.checkbox || false,
                    isNew: row.properties.isNew?.formula?.boolean || false,
                };
            } catch (err) {
                console.error('項目のマッピングエラー:', err);
                return null;
            }
        }).filter(Boolean).filter((item: any) => item.title);

        // 総ページ数を計算
        const totalItems = data.results.length; // この値は正確ではない可能性があります（NotionのAPIの制限による）
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
        return NextResponse.json(
            {error: 'イベント一覧の取得に失敗しました'},
            {status: 500}
        );
    }
} 