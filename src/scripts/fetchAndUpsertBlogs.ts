import 'dotenv/config';

const { uploadImageToCloudflare } = require('../lib/cloudflare');
const { replaceImageUrlsInText } = require('../lib/utils/image-util');
const { notion } = require('../lib/notionClient');
const { supabase } = require('../lib/supabaseClient');


// const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_BLOG_DB_ID!;

// const supabase = createClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

async function fetchBlogsFromNotion() {
    const response = await notion.databases.query({
        database_id: databaseId,
    });

    return response.results as any[];
}

function extractPlainText(prop: any): string {
    if (!prop || !Array.isArray(prop)) return '';
    return prop.map((t: any) => t.plain_text).join('');
}

async function fetchAndUpsertBlogs() {
    const pages = await fetchBlogsFromNotion();

    for (const page of pages) {
        const props = page.properties;

        const id = page.id;
        const title = extractPlainText(props.title?.title);
        const summary = props.summary?.rich_text?.[0]?.plain_text ?? '';
        const detail = props.detail?.rich_text?.[0]?.plain_text ?? '';
        const publishedAt = props.publishedAt?.date?.start ?? null;
        const source = props.source?.select?.name ?? null;
        const url = props.URL?.url ?? null;
        const category = (props.category?.multi_select ?? []).map((c: any) => c.name);
        const featured = props.featured?.checkbox ?? false;
        const status = props.status?.select?.name ?? null;
        const created_time = page.created_time;
        const last_edited_time = page.last_edited_time;

        const rawCoverUrl = props.cover?.files?.[0]?.file?.url ?? props.cover?.files?.[0]?.external?.url ?? null;
        const optimizedCoverUrl = rawCoverUrl ? await uploadImageToCloudflare(rawCoverUrl) : null;

        // Dummy block HTML or JSON for now
        const contentHtml = await generateDummyHtmlFromBlocks(id); // Replace with actual Notion blocks parser
        const optimizedContentHtml = await replaceImageUrlsInText(contentHtml);

        await supabase.from('blogs').upsert({
            id,
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
            created_time,
            last_edited_time,
            content_html: optimizedContentHtml,
            json_raw: page,
        });
    }
}

// Dummy implementation — should be replaced with block rendering logic
async function generateDummyHtmlFromBlocks(pageId: string): Promise<string> {
    return `<p>This is a placeholder for rendered Notion blocks for page ${pageId}.</p>`;
}

fetchAndUpsertBlogs().then(() => {
    console.log('Blogs fetched and upserted.');
}).catch(console.error);
