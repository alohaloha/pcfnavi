import 'dotenv/config';
import { notion } from '@/lib/notionClient';
import { supabase } from '@/lib/supabaseClient';
import { uploadImageWithCache } from '@/lib/cloudflareCache';
import {
    BlockObjectResponse,
    PartialBlockObjectResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

const databaseId = process.env.NOTION_BLOG_DB_ID!;

async function fetchBlogsFromNotion() {
    const response = await notion.databases.query({ database_id: databaseId });
    return response.results as any[];
}

function extractPlainText(richText: RichTextItemResponse[]): string {
    if (!Array.isArray(richText)) return '';
    return richText.map((t) => t.plain_text).join('');
}

async function fetchBlocks(blockId: string) {
    const blocks = await notion.blocks.children.list({ block_id: blockId });
    return blocks.results as (BlockObjectResponse | PartialBlockObjectResponse)[];
}

async function fetchAndUpsertBlogs() {
    const pages = await fetchBlogsFromNotion();

    for (const page of pages) {
        const props = page.properties;
        const pageId = page.id;
        const title = extractPlainText(props.title?.title);
        const summary = props.summary?.rich_text?.[0]?.plain_text ?? '';
        const detail = props.detail?.rich_text?.[0]?.plain_text ?? '';
        const publishedAt = props.publishedAt?.date?.start ?? null;
        const source = props.source?.select?.name ?? null;
        const url = props.URL?.url ?? null;
        const category = (props.category?.multi_select ?? []).map((c: any) => c.name);
        const featured = props.featured?.checkbox ?? false;
        const status = props.status?.select?.name ?? null;
        const createdTime = page.created_time;
        const lastEditedTime = page.last_edited_time;

        const rawCoverUrl = props.cover?.files?.[0]?.file?.url ?? props.cover?.files?.[0]?.external?.url ?? null;
        const optimizedCoverKey = rawCoverUrl ? await uploadImageWithCache(rawCoverUrl) : null;

        await supabase.from('blog_pages').upsert({
            id: pageId,
            title,
            summary,
            detail,
            published_at: publishedAt,
            source,
            url,
            category,
            featured,
            cover: optimizedCoverKey,
            status,
            created_time: createdTime,
            last_edited_time: lastEditedTime,
        });

        const blocks = await fetchBlocks(pageId);

        for (let index = 0; index < blocks.length; index++) {
            const block = blocks[index];
            if (!('type' in block)) continue;

            const blockId = block.id;
            const blockType = block.type;
            const richTexts = (block as any)[blockType]?.rich_text ?? [];

            await supabase.from('blog_blocks').insert({
                id: block.id,
                page_id: page.id,
                type: block.type,
                parent_id: (block.parent as any)?.block_id ?? null,
                order: index,
                is_toggleable: (block as any).toggleable ?? false,
                color: (block as any)[block.type]?.color ?? null,
                has_children: block.has_children ?? false,
            });

            for (let rtIndex = 0; rtIndex < richTexts.length; rtIndex++) {
                const richText = richTexts[rtIndex];
                await supabase.from('blog_rich_texts').insert({
                    block_id: blockId,
                    order: rtIndex,
                    plane_text: richText?.plain_text ?? null,
                    href: richText?.href ?? null,
                });
            }
        }
    }
}

fetchAndUpsertBlogs()
    .then(() => console.log('Blogs fetched and upserted.'))
    .catch(console.error);
