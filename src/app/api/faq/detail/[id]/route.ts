import {NextResponse} from 'next/server';
import {Client} from '@notionhq/client';
import {API_CONFIG} from '@/lib/constants';

const notion = new Client({auth: API_CONFIG.NOTION_API_SECRET});
const API_VERSION = API_CONFIG.NOTION_VERSION;

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const {id} = await context.params;

    try {
        const res = await notion.blocks.children.list({block_id: id});
        return NextResponse.json({blocks: res.results});
    } catch (error) {
        console.error('FAQ詳細の取得に失敗しました', error);
        return NextResponse.json({error: 'FAQ詳細の取得に失敗しました'}, {status: 500});
    }
}
