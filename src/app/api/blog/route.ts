// app/api/blog/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { getCloudflareImageUrl } from '@/lib/cloudflare';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('blog_pages')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'ブログ一覧の取得に失敗しました' }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ items: [] });
        }

        console.log('ブログ一覧取得:整形前', data.map(item => item.cover));
        const items = (data as any[])
            .filter((row) => row.status === 'published' && row.title)
            .map((row) => ({
                id: row.id,
                title: row.title,
                summary: row.summary,
                cover: row.cover ? getCloudflareImageUrl(row.cover) : '',
                category: row.category ?? [],
                publishedAt: row.published_at,
                featured: row.featured,
                isNew: isNew(row.published_at),
                status: row.status,
            }));
        console.log('ブログ一覧取得:整形後', items.map(item => item.cover));

        return NextResponse.json({ items });
    } catch (error) {
        console.error('ブログ一覧の取得に失敗しました', error);
        return NextResponse.json({ error: 'ブログ一覧の取得に失敗しました' }, { status: 500 });
    }
}

// 新着判定ロジック（任意：7日以内などで変更可）
function isNew(publishedAt: string | null): boolean {
    if (!publishedAt) return false;
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = now.getTime() - publishedDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7;
}
