import { supabase } from '@/lib/supabaseClient';

export async function getCachedCloudflareKey(notionKey: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('notion_image_cache')
        .select('cloudflare_key')
        .eq('notion_key', notionKey)
        .single();

    if (error || !data) return null;
    return data.cloudflare_key;
}

export async function saveCloudflareKeyToCache(notionKey: string, cloudflareKey: string): Promise<void> {
    await supabase.from('notion_image_cache').upsert({
        notion_key: notionKey,
        cloudflare_key: cloudflareKey,
    });
}
