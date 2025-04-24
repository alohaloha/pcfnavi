import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    // まずスラッグからページIDを取得
    const dbRes = await fetch(`${NOTION_URL}/databases/${BLOG_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': `${API_VERSION}`,
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
                equals: '公開'
              }
            }
          ]
        }
      }),
      next: { revalidate: 3600 } // 1時間キャッシュ
    });

    if (!dbRes.ok) {
      throw new Error(`Notion API error: ${dbRes.status}`);
    }

    const dbData = await dbRes.json();
    
    if (dbData.results.length === 0) {
      return NextResponse.json({ error: 'ブログ記事が見つかりません' }, { status: 404 });
    }
    
    const pageId = dbData.results[0].id;
    const pageData = dbData.results[0];
    
    // ページの内容を取得
    const contentRes = await fetch(`${NOTION_URL}/blocks/${pageId}/children`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': `${API_VERSION}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // 1時間キャッシュ
    });

    if (!contentRes.ok) {
      throw new Error(`Notion API error: ${contentRes.status}`);
    }

    const contentData = await contentRes.json();
    
    return NextResponse.json({ 
      blocks: contentData.results,
      title: pageData.properties.title.title[0]?.plain_text || '',
      summary: pageData.properties.summary.rich_text[0]?.plain_text || '',
      cover: pageData.properties.cover.files[0]?.file?.url || pageData.properties.cover.files[0]?.external?.url || '',
      category: pageData.properties.category.multi_select.map((item: any) => item.name) || [],
      publishedAt: pageData.properties.publishedAt.date?.start || ''
    });
  } catch (error) {
    console.error('ブログ詳細の取得に失敗しました', error);
    return NextResponse.json({ error: 'ブログ詳細の取得に失敗しました' }, { status: 500 });
  }
} 