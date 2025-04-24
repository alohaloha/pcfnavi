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
    console.log('ブログ詳細取得:', { slug });
    
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
          property: 'slug',
          rich_text: {
            equals: slug
          }
        }
      }),
      next: { revalidate: 3600 } // 1時間キャッシュ
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      console.error(`Notion API error: ${dbRes.status}`, errorText);
      throw new Error(`Notion API error: ${dbRes.status} - ${errorText}`);
    }

    const dbData = await dbRes.json();
    console.log('スラッグに一致する記事件数:', dbData.results?.length || 0);
    
    if (!dbData.results || dbData.results.length === 0) {
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
      const errorText = await contentRes.text();
      console.error(`Notion API error: ${contentRes.status}`, errorText);
      throw new Error(`Notion API error: ${contentRes.status} - ${errorText}`);
    }

    const contentData = await contentRes.json();
    console.log('ブロック数:', contentData.results?.length || 0);
    
    // 詳細構造の確認
    console.log('ページデータプロパティ:', Object.keys(pageData.properties));
    
    return NextResponse.json({ 
      blocks: contentData.results,
      title: pageData.properties.title?.title?.[0]?.plain_text || '',
      summary: pageData.properties.summary?.rich_text?.[0]?.plain_text || '',
      cover: pageData.properties.cover?.files?.[0]?.file?.url || 
             pageData.properties.cover?.files?.[0]?.external?.url || '',
      category: pageData.properties.category?.multi_select?.map((item: any) => item.name) || [],
      publishedAt: pageData.properties.publishedAt?.date?.start || '',
      status: pageData.properties.status?.select?.name || '',
      isNew: pageData.properties.isNew?.formula?.boolean || false,
      featured: pageData.properties.featured?.checkbox || false
    });
  } catch (error) {
    console.error('ブログ詳細の取得に失敗しました', error);
    return NextResponse.json({ error: 'ブログ詳細の取得に失敗しました' }, { status: 500 });
  }
} 