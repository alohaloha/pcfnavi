import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const NOTION_VERSION = API_CONFIG.NOTION_VERSION!;
const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;

export async function GET(
    request: Request,
    {params}: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        // ブログエントリの取得
        const blogResponse = await fetch(`${NOTION_URL}/databases/${BLOG_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filter: {
                    and: [
                        {
                            property: 'slug',
                            rich_text: {
                                equals: slug
                            }
                        },
                        {
                            property: 'status',
                            select: {
                                equals: 'published'
                            }
                        }
                    ]
                }
            }),
            next: {revalidate: 3600} // 1時間キャッシュ
        });

        if (!blogResponse.ok) {
            throw new Error(`Notion API error: ${blogResponse.status}`);
        }

        const blogData = await blogResponse.json();

        if (!blogData.results || blogData.results.length === 0) {
            return NextResponse.json({error: 'ブログ記事が見つかりません'}, {status: 404});
        }

        const pageId = blogData.results[0].id;
        const pageData = blogData.results[0];

        // ページコンテンツの取得
        const contentResponse = await fetch(`${NOTION_URL}/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
            },
            next: {revalidate: 3600} // 1時間キャッシュ
        });

        if (!contentResponse.ok) {
            throw new Error(`Notion API content error: ${contentResponse.status}`);
        }

        const contentData = await contentResponse.json();

        // カテゴリ情報の抽出
        const categories = pageData.properties.category?.multi_select?.map((item: any) => item.name) || [];

        return NextResponse.json({
            id: pageData.id,
            title: pageData.properties.title?.title?.[0]?.plain_text || '',
            slug: pageData.properties.slug?.rich_text?.[0]?.plain_text || pageId,
            summary: pageData.properties.summary?.rich_text?.[0]?.plain_text || '',
            cover: pageData.properties.cover?.files?.[0]?.file?.url ||
                pageData.properties.cover?.files?.[0]?.external?.url || '',
            category: categories,
            publishedAt: pageData.properties.publishedAt?.date?.start || '',
            featured: pageData.properties.featured?.checkbox || false,
            isNew: pageData.properties.isNew?.formula?.boolean || false,
            content: contentData.results || [],
        });
    } catch (error) {
        console.error('ブログ記事の取得に失敗しました', error);
        return NextResponse.json({error: 'ブログ記事の取得に失敗しました'}, {status: 500});
    }
} 