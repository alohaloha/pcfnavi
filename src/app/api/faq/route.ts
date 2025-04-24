import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const FAQ_DB_ID = API_CONFIG.NOTION_FAQ_DB_ID!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;

export async function GET() {
  try {
    const res = await fetch(`${NOTION_URL}/databases/${FAQ_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': `${API_VERSION}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // 1時間キャッシュ
    });

    if (!res.ok) {
      throw new Error(`Notion API error: ${res.status}`);
    }

    const data = await res.json();
    
    return NextResponse.json({ 
      items: data.results.map((row: any) => ({
        id: row.id,
        question: row.properties.question.title[0]?.plain_text || '',
        answer: row.properties.answer.rich_text[0]?.plain_text || '',
        category: row.properties.category.multi_select.map((item: any) => item.name) || [],
      })).filter((item: any) => item.question && item.answer && item.category.length > 0)
    });
  } catch (error) {
    console.error('FAQの取得に失敗しました', error);
    return NextResponse.json({ error: 'FAQの取得に失敗しました' }, { status: 500 });
  }
} 