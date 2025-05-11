import {NextRequest, NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const blockId = searchParams.get('blockId');

    if (!blockId) {
        return NextResponse.json({error: 'blockId is required'}, {status: 400});
    }

    try {
        // APIのURLやヘッダーを確認
        const NOTION_URL = API_CONFIG.NOTION_API_URL;
        const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET;
        const API_VERSION = API_CONFIG.NOTION_VERSION;

        console.log(`Fetching blocks for page ID: ${blockId}`);
        console.log(`Using Notion URL: ${NOTION_URL}`);

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

        // Notionのブロック取得APIエンドポイント
        const res = await fetch(`${NOTION_URL}/blocks/${blockId}/children`, {
            method: 'GET',
            headers,
            // next: {revalidate: 60} // キャッシュを60秒間有効に
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Notion API error:', errorText);
            return NextResponse.json(
                {error: `API error: ${res.status}`, details: errorText},
                {status: res.status}
            );
        }

        const data = await res.json();
        console.log(`Successfully fetched ${data.results.length} blocks.`);

        return NextResponse.json({
            blocks: data.results,
            status: 'success'
        });
    } catch (error: any) {
        console.error('Error fetching blocks:', error);
        return NextResponse.json({
            error: 'Failed to fetch blocks',
            message: error.message
        }, {status: 500});
    }
} 