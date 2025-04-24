import {NextResponse} from 'next/server';
import {API_CONFIG} from '@/lib/constants';

const NOTION_URL = API_CONFIG.NOTION_API_URL!;
const NOTION_TOKEN = API_CONFIG.NOTION_API_SECRET!;
const BLOG_DB_ID = API_CONFIG.NOTION_BLOG_DB_ID!;
const API_VERSION = API_CONFIG.NOTION_VERSION!;

export async function GET() {
    try {
        console.log('APIパラメータ確認:', {
            NOTION_URL,
            BLOG_DB_ID,
            API_VERSION,
            TOKEN_LENGTH: NOTION_TOKEN ? NOTION_TOKEN.length : 0
        });

        // フィルタと並び替えを再度追加
        const res = await fetch(`${NOTION_URL}/databases/${BLOG_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': `${API_VERSION}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // statusプロパティが存在する場合のみフィルターを適用
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
            console.error(`Notion API error: ${res.status}`, errorData);
            throw new Error(`Notion API error: ${res.status} - ${errorData}`);
        }

        const data = await res.json();
        console.log('ブログデータ件数:', data.results?.length || 0);

        // データベース構造を検証
        if (data.results && data.results.length > 0) {
            const firstItem = data.results[0];
            // formulaプロパティの構造を確認するためのログ
            console.log('isNewプロパティの構造:', firstItem.properties.isNew);
            console.log('最初の項目のプロパティ:', Object.keys(firstItem.properties));
        }

        return NextResponse.json({
            items: data.results.map((row: any) => {
                try {
                    return {
                        id: row.id,
                        title: row.properties.title?.title?.[0]?.plain_text || '',
                        slug: row.properties.slug?.rich_text?.[0]?.plain_text || row.id,
                        summary: row.properties.summary?.rich_text?.[0]?.plain_text || '',
                        cover: row.properties.cover?.files?.[0]?.file?.url ||
                            row.properties.cover?.files?.[0]?.external?.url || '',
                        category: row.properties.category?.multi_select?.map((item: any) => item.name) || [],
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