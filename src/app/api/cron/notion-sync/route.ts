import { notion } from '@/lib/notionClient';
import { safeKVSet } from '@/lib/utils/safeKVSet';
import {NextRequest, NextResponse} from 'next/server';

const dbs = {
    faq: process.env.NOTION_FAQ_DB_ID!,
    // blog: process.env.NOTION_BLOG_DB_ID!,
    event: process.env.NOTION_EVENT_DB_ID!,
};

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    if (process.env.ENABLE_CRON !== 'true') {
        return NextResponse.json({
            message: `Skipped: current env is '${process.env.VERCEL_ENV}'`,
        });
    }


    const results: Record<string, number> = {};

    for (const [key, dbId] of Object.entries(dbs)) {
        const res = await notion.databases.query({ database_id: dbId });
        const items = res.results;

        // 一覧保存（セーフティ付き）
        await safeKVSet(key, items, `${key}一覧`);
        results[key] = items.length;

        // blocks 保存（セーフティ付き）
        const blocks: { id: string; blocks: any[] }[] = [];

        for (const item of items) {
            try {
                const blockRes = await notion.blocks.children.list({
                    block_id: item.id,
                });
                blocks.push({ id: item.id, blocks: blockRes.results });
            } catch (err) {
                console.warn(`Block fetch failed for ${item.id}`, err);
            }
        }

        await safeKVSet(`${key}:block`, blocks, `${key}ブロック`);
    }

    return NextResponse.json({ ok: true, synced: results });
}
