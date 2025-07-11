// app/api/faq/route.ts
import {kv} from "@/lib/kvClient";
import {NextResponse} from "next/server";
import {safeParseJson} from "@/lib/utils/safeParseJson";
import {RichText} from '@/types/notion';

export async function GET() {
    try {
        const raw = await kv.get('faq');
        const data = safeParseJson<any[]>(raw, 'faq');

        if (!data) {
            return NextResponse.json({ items: [] });
        }

        const items = data.map((row) => ({
            id: row.id,
            question: row.properties.question.title[0]?.plain_text || '',
            answer: row.properties.answer.rich_text.map((text: RichText) => text.plain_text).join('') || '',
            answer_rich_text: row.properties.answer.rich_text || [],
            show_blocks: row.properties.show_blocks?.checkbox || false,
            category: row.properties.category.multi_select.map((item: any) => item.name) || [],
        })).filter(item => item.question && item.answer && item.category.length > 0);

        return NextResponse.json({items});
    } catch (error) {
        console.error('FAQ一覧の取得に失敗しました', error);
        return NextResponse.json({error: 'FAQ一覧の取得に失敗しました'}, {status: 500});
    }
}

