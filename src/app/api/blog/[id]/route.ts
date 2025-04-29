import {NextResponse} from 'next/server';
import {notion} from '@/lib/notionClient';
import {API_CONFIG} from '@/lib/constants';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await context.params;

        const page = await notion.pages.retrieve({page_id: id});
        const blocks = await notion.blocks.children.list({block_id: id});

        if (page.object !== 'page' || !('properties' in page)) {
            throw new Error('Invalid Notion page object structure');
        }

        const properties = (page as any).properties;

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
            blocks: blocks.results || [],
        });
    } catch (error) {
        console.error('ブログ詳細の取得に失敗しました', error);
        return NextResponse.json({error: 'ブログ詳細の取得に失敗しました'}, {status: 500});
    }
}
