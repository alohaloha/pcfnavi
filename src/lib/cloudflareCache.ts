import { uploadImageToCloudflare } from '@/lib/cloudflare';
import { extractNotionImageKey, extractCloudflareKeyFromUrl } from '@/lib/utils/image-util';
import { getCachedCloudflareKey, saveCloudflareKeyToCache } from '@/lib/utils/image-cache';

export async function uploadImageWithCache(notionUrl: string): Promise<string> {
    const notionKey = extractNotionImageKey(notionUrl);
    console.log({ notionKey });
    const cached = await getCachedCloudflareKey(notionKey);
    if (cached) return cached;

    const uploadedUrl = await uploadImageToCloudflare(notionUrl);
    const cloudflareKey = extractCloudflareKeyFromUrl(uploadedUrl);
    await saveCloudflareKeyToCache(notionKey, cloudflareKey);

    return cloudflareKey;
}
