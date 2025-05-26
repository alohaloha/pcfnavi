import 'dotenv/config';
import { notion } from '@/lib/notionClient';
import { supabase } from '@/lib/supabaseClient';
import {
    BlockObjectResponse,
    PartialBlockObjectResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {uploadImageWithCache} from "@/lib/cloudflareCache";

const databaseId = process.env.NOTION_EVENT_DB_ID!;

async function fetchEventsFromNotion() {
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

async function processBlock(block: BlockObjectResponse | PartialBlockObjectResponse, pageId: string, parentId: string | null, order: number) {
    if (!('type' in block)) return;

    const blockId = block.id;
    const blockType = block.type;
    let richTexts = [];
    let optimizedBlockFileKey = null;
    let captionText = null;
    let captionHtml = null;

    if (blockType !== 'image' && blockType !== 'file') {
        richTexts = (block as any)[blockType]?.rich_text ?? [];
    }

    if (blockType === 'image') {
        if (block.image.type === 'file') {
            const rawFileUrl = block.image.file.url;
            optimizedBlockFileKey = rawFileUrl ? await uploadImageWithCache(rawFileUrl) : null;
        } else if (block.image.type === 'external') {
            const rawFileUrl = block.image.external.url;
            optimizedBlockFileKey = rawFileUrl ? await uploadImageWithCache(rawFileUrl) : null;
        }

        captionText = block.image?.caption?.map(c => c.plain_text).join('') || null;
        captionHtml = block.image?.caption?.map(c => {
            const content = c.plain_text;
            const href = c.href;
            return href
                ? `<a class="underline text-blue text-right" href="${href}" target="_blank" rel="noopener noreferrer">${content}</a>`
                : content;
        }).join('') || null;
    }

    await supabase.from('event_blocks').insert({
        id: blockId,
        page_id: pageId,
        type: blockType,
        parent_id: parentId,
        order: order,
        is_toggleable: (block as any).toggleable ?? false,
        color: (block as any)[blockType]?.color ?? null,
        has_children: block.has_children ?? false,
        cloudflare_key: optimizedBlockFileKey,
        caption_text: captionText,
        caption_html: captionHtml,
    });

    for (let rtIndex = 0; rtIndex < richTexts.length; rtIndex++) {
        const richText = richTexts[rtIndex];
        await supabase.from('event_rich_texts').insert({
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

async function fetchAndUpsertEvents() {
    const deleted = await supabase.from('event_pages').delete().neq('status', null);
    console.log('Deleted old event pages:', deleted);

    const pages = await fetchEventsFromNotion();

    for (const page of pages) {
        const props = page.properties;
        const pageId = page.id;
        const title = extractPlainText(props.title?.title);
        const summary = props.summary?.rich_text?.[0]?.plain_text ?? '';
        const detail = props.detail?.rich_text?.[0]?.plain_text ?? '';
        const location = props.location?.rich_text?.[0]?.plain_text ?? '';
        const status = props.status?.select?.name ?? null;
        const capacity = props.capacity?.number?.number ?? null;
        const price = props.price?.number?.number ?? null;
        const organizer = props.organizer?.rich_text?.[0]?.plain_text ?? '';
        const source = props.source?.url ?? null;
        const category = (props.category?.multi_select ?? []).map((c: any) => c.name);
        const featured = props.featured?.checkbox ?? false;
        const pinned = props.pinned?.checkbox ?? false;
        const start_at = props.eventDate?.date?.start ? new Date(props.eventDate.date.start) : null;
        const end_at = props.eventDate?.date?.end ? new Date(props.eventDate.date.end) : null;
        const is_all_day = props.eventDate?.date?.start?.length === 10; // "YYYY-MM-DD"形式かどうか
        const createdTime = page.created_time;
        const lastEditedTime = page.last_edited_time;

        await supabase.from('event_pages').upsert({
            id: pageId,
            title,
            summary,
            detail,
            start_at,
            end_at,
            is_all_day,
            location,
            status,
            capacity,
            price,
            organizer,
            source,
            category,
            featured,
            pinned,
            created_time: createdTime,
            last_edited_time: lastEditedTime,
        });

        const blocks = await fetchBlocks(pageId);
        for (let index = 0; index < blocks.length; index++) {
            await processBlock(blocks[index], pageId, null, index);
        }
    }
}

export { fetchAndUpsertEvents as run };

if (require.main === module) {
    fetchAndUpsertEvents()
        .then(() => console.log('Events fetched and upserted.'))
        .catch(console.error);
}
