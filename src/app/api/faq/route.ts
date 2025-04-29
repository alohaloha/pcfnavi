import {NextResponse} from 'next/server';
import {notion} from '@/lib/notionClient';

export async function GET() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_FAQ_DB_ID!,
        });

        const items = response.results.map((row: any) => ({
            id: row.id,
            question: row.properties.question.title[0]?.plain_text || '',
            answer: row.properties.answer.rich_text[0]?.plain_text || '',
            category: row.properties.category.multi_select.map((item: any) => item.name) || [],
        })).filter((item: any) => item.question && item.answer && item.category.length > 0);

        return NextResponse.json({items});
    } catch (error) {
        console.error('FAQ一覧の取得に失敗しました', error);
        return NextResponse.json({error: 'FAQ一覧の取得に失敗しました'}, {status: 500});
    }
}