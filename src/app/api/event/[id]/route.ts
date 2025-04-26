import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;
const EVENT_DB_ID = API_CONFIG.NOTION_EVENT_DB_ID!;

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const {id} = params;

        // Vercelプレビュー環境のバイパストークンの取得
        const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
        const headers: HeadersInit = {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': API_VERSION,
        };

        // プレビュー環境のバイパストークンがある場合はヘッダーに追加
        if (protectionBypassSecret) {
            headers['x-vercel-protection-bypass'] = protectionBypassSecret;
        }

        // ページコンテンツの取得
        const contentResponse = await fetch(`${NOTION_URL}/pages/${id}`, {
            method: 'GET',
            headers,
            next: {revalidate: 1800} // 30分キャッシュ
        });

        if (!contentResponse.ok) {
            throw new Error(`Notion API content error: ${contentResponse.status}`);
        }
        const contentData = await contentResponse.json();
        console.log('取得したイベントデータ:', contentData.id);

        // ブロックデータの取得
        const blockResponse = await fetch(`${NOTION_URL}/blocks/${contentData.id}/children`, {
            method: 'GET',
            headers,
            next: {revalidate: 1800} // 30分キャッシュ
        });

        if (!blockResponse.ok) {
            throw new Error(`Notion API block error: ${blockResponse.status}`);
        }

        const blockData = await blockResponse.json();
        // カテゴリ情報の抽出
        const categories = contentData.properties.category?.multi_select?.map((item: any) => item.name) || [];

        return NextResponse.json({
            id: contentData.id,
            title: contentData.properties.title?.title?.[0]?.plain_text || '',
            summary: contentData.properties.summary?.rich_text?.[0]?.plain_text || '',
            detail: contentData.properties.detail?.rich_text?.[0]?.plain_text || '',
            eventDate: contentData.properties.eventDate?.date?.start || '',
            location: contentData.properties.location?.rich_text?.[0]?.plain_text || '',
            capacity: contentData.properties.capacity?.number || 0,
            price: contentData.properties.price?.number || null,
            organizer: contentData.properties.organizer?.rich_text?.[0]?.plain_text || '',
            source: contentData.properties.source?.url || '',
            status: contentData.properties.status?.select?.name || '',
            category: categories,
            cover: contentData.properties.cover?.files?.[0]?.file?.url ||
                contentData.properties.cover?.files?.[0]?.external?.url || '',
            featured: contentData.properties.featured?.checkbox || false,
            pinned: contentData.properties.pinned?.checkbox || false,
            isNew: contentData.properties.isNew?.formula?.boolean || false,
            blocks: blockData.results || [],
        });
    } catch (error) {
        console.error('イベント詳細の取得に失敗しました', error);
        return NextResponse.json({error: 'イベント詳細の取得に失敗しました'}, {status: 500});
    }
} 