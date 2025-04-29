import {NextResponse} from 'next/server';
import {notion} from '@/lib/notionClient';
import {API_CONFIG} from '@/lib/constants';

const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;

export async function GET() {
    try {
        const response = await notion.databases.query({
            database_id: BLOG_DB_ID,
            filter: {
                property: 'status',
                select: {equals: 'published'}
            },
            sorts: [
                {
                    property: 'publishedAt',
                    direction: 'descending'
                }
            ]
        });

        const items = response.results.map((row: any) => {
            const properties = row.properties;

            return {
                id: row.id,
                title: properties.title?.title?.[0]?.plain_text || '',
                summary: properties.summary?.rich_text?.[0]?.plain_text || '',
                cover: properties.cover?.files?.[0]?.file?.url ||
                    properties.cover?.files?.[0]?.external?.url || '',
                category: properties.category?.multi_select?.map((item: any) => item.name) || [],
                publishedAt: properties.publishedAt?.date?.start || '',
                featured: properties.featured?.checkbox || false,
                isNew: properties.isNew?.formula?.boolean || false,
                status: properties.status?.select?.name || '',
            };
        }).filter(item => item.title);

        return NextResponse.json({items});
    } catch (error) {
        console.error('ブログ一覧の取得に失敗しました', error);
        return NextResponse.json({error: 'ブログ一覧の取得に失敗しました'}, {status: 500});
    }
}
