import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;
console.log('Vercel Debug | URL:', NOTION_URL);
console.log('Vercel Debug | TOKEN:', NOTION_TOKEN ? 'present' : 'missing');
console.log('Vercel Debug | VERSION:', API_VERSION);

export async function GET() {
    try {
        const res = await fetch(`${NOTION_URL}/databases/${BLOG_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': `${API_VERSION}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filter: {
                    property: 'status',
                    select: {
                        equals: 'published'
                    }
                },
                sorts: [
                    {
                        property: 'publishedAt',
                        direction: 'descending'
                    }
                ]
            }),
            next: {revalidate: 3600} // 1時間キャッシュ
        });

        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Notion API error: ${res.status} - ${errorData}`);
        }

        const data = await res.json();
        console.log('取得したブログ記事数:', data.results[0].properties);

        return NextResponse.json({
            items: data.results.map((row: any) => {
                try {
                    // カテゴリの抽出処理
                    const categoryProp = row.properties.category;
                    const categories = categoryProp?.multi_select?.map((item: any) => item.name) || [];

                    return {
                        id: row.id,
                        title: row.properties.title?.title?.[0]?.plain_text || '',
                        slug: `${row.id}`,
                        summary: row.properties.summary?.rich_text?.[0]?.plain_text || '',
                        cover: row.properties.cover?.files?.[0]?.file?.url ||
                            row.properties.cover?.files?.[0]?.external?.url || '',
                        category: categories,
                        publishedAt: row.properties.publishedAt?.date?.start || '',
                        featured: row.properties.featured?.checkbox || false,
                        isNew: row.properties.isNew?.formula?.boolean || false,
                        status: row.properties.status?.select?.name || '',
                    };
                } catch (err) {
                    console.error('項目のマッピングエラー:', err);
                    return null;
                }
            }).filter(Boolean).filter((item: any) => item.title)
        });
    } catch (error) {
        console.error('ブログ一覧の取得に失敗しました', error);
        return NextResponse.json({error: 'ブログ一覧の取得に失敗しました'}, {status: 500});
    }
} 