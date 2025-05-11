export function extractNotionImageKey(url: string): string {
    // 画像URL中の2つのUUIDを抽出（例: 4b8b666c-xxxx-xxxx-xxxx-xxxxxxxxxxxx/67cc1c56-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
    const match = url.match(/\/([0-9a-fA-F\-]{36})\/([0-9a-fA-F\-]{36})\//);
    if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid Notion image URL: ${url}`);
    }
    const notionKey = `${match[1]}/${match[2]}`;
    console.log({ notionKey }); // デバッグ用（必要に応じて削除）
    return notionKey;
}


export function extractCloudflareKeyFromUrl(url: string): string {
    const match = url.match(/https:\/\/imagedelivery\.net\/[\w-]+\/([\w-]+)\/public/);
    if (!match || !match[1]) throw new Error(`Invalid Cloudflare URL: ${url}`);
    return match[1];
}
