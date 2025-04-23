import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // APIのURLやヘッダーを確認
    const NOTION_URL = API_CONFIG.NOTION_API_URL;
    const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET;
    const API_VERSION = API_CONFIG.NOTION_VERSION;

    console.log(`Fetching blocks for page ID: ${id}`);
    console.log(`Using Notion URL: ${NOTION_URL}`);

    // Notionのブロック取得APIエンドポイント
    const res = await fetch(`${NOTION_URL}/blocks/${id}/children`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': API_VERSION,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // キャッシュを60秒間有効に
    });

    // レスポンスの内容をログに出力（デバッグ用）
    const responseText = await res.text();
    console.log('API Response:', responseText);
    
    if (!res.ok) {
      return NextResponse.json(
        { error: `API error: ${res.status}`, details: responseText }, 
        { status: res.status }
      );
    }

    // JSONとしてパース
    const data = JSON.parse(responseText);
    
    return NextResponse.json({ 
      blocks: data.results,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error fetching FAQ detail:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch FAQ detail', 
      message: error.message 
    }, { status: 500 });
  }
} 