// app/api/faq/detail/[id]/route.ts
import { kv } from '@/lib/kvClient';
import { NextResponse } from 'next/server';
import { safeParseJson } from '@/lib/utils/safeParseJson';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const rawBlocks = await kv.get<string>('faq:block');
        const blocksArray = safeParseJson<{ id: string; blocks: any[] }[]>(rawBlocks, 'faq:block');
        if (!blocksArray) {
            return NextResponse.json({ error: 'Block data not found in KV' }, { status: 404 });
        }

        const blockEntry = blocksArray.find(item => item.id === id);

        if (!blockEntry) {
            return NextResponse.json({ error: 'No blocks found for this ID' }, { status: 404 });
        }

        return NextResponse.json({ blocks: blockEntry.blocks });
    } catch (error) {
        console.error('FAQ詳細の取得に失敗しました', error);
        return NextResponse.json({ error: 'FAQ詳細の取得に失敗しました' }, { status: 500 });
    }
}
