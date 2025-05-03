import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { uploadImageToCloudflare } from '@/lib/cloudflare';
import { replaceImageUrlsInText } from '@/lib/utils/image-util';
import { notion } from '@/lib/notionClient';
import { supabase } from '@/lib/supabaseClient';
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
        const optimizedCoverUrl = rawCoverUrl ? await uploadImageToCloudflare(rawCoverUrl) : null;

        // Insert into blog_pages
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
            cover: optimizedCoverUrl,
            status,
            created_time: createdTime,
            last_edited_time: lastEditedTime,
        });

        const blocks = await fetchBlocks(pageId);

        for (const block of blocks) {
            if (!('type' in block)) continue;

            const blockId = block.id;
            const blockType = block.type;
            const richTexts = (block as any)[blockType]?.rich_text ?? [];

            await supabase.from('blog_blocks').upsert({
                id: blockId,
                page_id: pageId,
                type: blockType,
                json_raw: block,
            });

            for (const richText of richTexts) {
                await supabase.from('blog_rich_texts').insert({
                    id: uuidv4(),
                    block_id: blockId,
                    text: richText.plain_text,
                    annotations: richText.annotations,
                    href: richText.href,
                });
            }
        }
    }
}

fetchAndUpsertBlogs()
    .then(() => console.log('Blogs fetched and upserted.'))
    .catch(console.error);
