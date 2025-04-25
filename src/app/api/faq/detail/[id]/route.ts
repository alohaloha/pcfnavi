import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const {id} = params;
    try {
        const res = await fetch(`${NOTION_URL}/blocks/${id}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': `${API_VERSION}`,
                'Content-Type': 'application/json',
            },
            next: {revalidate: 3600} // 1時間キャッシュ
        });

        if (!res.ok) {
            throw new Error(`Notion API error: ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json({blocks: data.results});
    } catch (error) {
        console.error('FAQ詳細の取得に失敗しました', error);
        return NextResponse.json({error: 'FAQ詳細の取得に失敗しました'}, {status: 500});
    }
}
