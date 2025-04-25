import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const NOTION_VERSION = API_CONFIG.NOTION_VERSION!;
const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;

export async function GET(
    request: Request,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await context.params;
        const { slug } = params;
        
        // ページコンテンツの取得
        const contentResponse = await fetch(`${NOTION_URL}/pages/${slug}`, {
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
        console.log('取得したページデータ:', contentData);

        const blockResponse = await fetch(`${NOTION_URL}/blocks/${contentData.id}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': NOTION_VERSION,
            },
            next: {revalidate: 3600} // 1時間キャッシュ
        });
        if (!blockResponse.ok) {
            throw new Error(`Notion API block error: ${blockResponse.status}`);
        }
        const blockData = await blockResponse.json();
        // console.log('取得したブロックデータ:', blockData);
        // カテゴリ情報の抽出
        const categories = contentData.properties.category?.multi_select?.map((item: any) => item.name) || [];

        return NextResponse.json({
            id: contentData.id,
            title: contentData.properties.title?.title?.[0]?.plain_text || '',
            slug: contentData.properties.slug?.rich_text?.[0]?.plain_text || slug,
            summary: contentData.properties.summary?.rich_text?.[0]?.plain_text || '',
            detail: contentData.properties.detail?.rich_text?.[0]?.plain_text || '',
            cover: contentData.properties.cover?.files?.[0]?.file?.url ||
                contentData.properties.cover?.files?.[0]?.external?.url || '',
            category: categories,
            publishedAt: contentData.properties.publishedAt?.date?.start || '',
            featured: contentData.properties.featured?.checkbox || false,
            isNew: contentData.properties.isNew?.formula?.boolean || false,
            blocks: blockData.results || [],
        });
    } catch (error) {
        console.error('ブログ記事の取得に失敗しました', error);
        return NextResponse.json({error: 'ブログ記事の取得に失敗しました'}, {status: 500});
    }
} 