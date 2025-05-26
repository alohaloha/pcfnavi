import 'dotenv/config';
import { notion } from '@/lib/notionClient';
import { supabase } from '@/lib/supabaseClient';
import { uploadImageWithCache } from '@/lib/cloudflareCache';
import {
    BlockObjectResponse, FileBlockObjectResponse, ImageBlockObjectResponse,
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
    return blocks.results as (BlockObjectResponse | PartialBlockObjectResponse | ImageBlockObjectResponse | FileBlockObjectResponse)[];
}

async function processBlock(block: BlockObjectResponse | PartialBlockObjectResponse | ImageBlockObjectResponse | FileBlockObjectResponse, pageId: string, parentId: string | null, order: number) {
    if (!('type' in block)) return;

    const blockId = block.id;
    const blockType = block.type;
    let optimizedBlockFileKey = null;
    const richTexts = (block as any)[blockType]?.rich_text ?? [];

    if (blockType === 'image') {
        if (block.image.type === 'file') {
            const rawFileUrl = block.image.file.url;
            optimizedBlockFileKey = rawFileUrl ? await uploadImageWithCache(rawFileUrl) : null;
        } else if (block.image.type === 'external') {
            const rawFileUrl = block.image.external.url;
            optimizedBlockFileKey = rawFileUrl ? await uploadImageWithCache(rawFileUrl) : null;
        }
    }

    await supabase.from('blog_blocks').insert({
        id: block.id,
        page_id: pageId,
        type: block.type,
        parent_id: parentId,
        order: order,
        is_toggleable: (block as any).toggleable ?? false,
        color: (block as any)[block.type]?.color ?? null,
        has_children: block.has_children ?? false,
        cloudflare_key: optimizedBlockFileKey,
    });

    for (let rtIndex = 0; rtIndex < richTexts.length; rtIndex++) {
        const richText = richTexts[rtIndex];
        await supabase.from('blog_rich_texts').insert({
            block_id: blockId,
            order: rtIndex,
            plain_text: richText?.plain_text ?? null,
            href: richText?.href ?? null,
        });
    }

    // 子要素がある場合は再帰的に処理
    if (block.has_children) {
        const childBlocks = await fetchBlocks(blockId);
        for (let childIndex = 0; childIndex < childBlocks.length; childIndex++) {
            await processBlock(childBlocks[childIndex], pageId, blockId, childIndex);
        }
    }
}

async function fetchAndUpsertBlogs() {
    const deleted = await supabase.from('blog_pages').delete().neq('status', null);
    console.log('Deleted old blog pages:', deleted);
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
            await processBlock(blocks[index], pageId, null, index);
        }
    }
}

export { fetchAndUpsertBlogs as run };

if (require.main === module) {
    fetchAndUpsertBlogs()
        .then(() => console.log('Blogs fetched and upserted.'))
        .catch(console.error);
}
