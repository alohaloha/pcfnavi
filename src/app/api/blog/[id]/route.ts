import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { getCloudflareImageUrl } from '@/lib/cloudflare';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        // メインページ情報取得
        const { data: page, error: pageError } = await supabase
            .from('blog_pages')
            .select('*')
            .eq('id', id)
            .single();
        console.log({ page });

        if (pageError || !page) {
            return NextResponse.json({ error: 'blog not found' }, { status: 404 });
        }

        // ブロック情報取得
        const { data: blocks, error: blockError } = await supabase
            .from('blog_blocks')
            .select('*')
            .eq('page_id', id)
            .order('order', { ascending: true });

        if (blockError) throw blockError;

        // リッチテキストをブロックごとに紐付け
        const { data: richTexts, error: rtError } = await supabase
            .from('blog_rich_texts')
            .select('*')
            .in('block_id', blocks.map(b => b.id))
            .order('order', { ascending: true });
        console.log({ richTexts });

        if (rtError) throw rtError;

        const blocksWithText = blocks.map(block => ({
            ...block,
            rich_texts: richTexts.filter(rt => rt.block_id === block.id),
        }));

        return NextResponse.json({
            id: page.id,
            title: page.title,
            summary: page.summary,
            detail: page.detail,
            cover: page.cover ? getCloudflareImageUrl(page.cover) : '',
            category: page.category ?? [],
            publishedAt: page.published_at,
            featured: page.featured,
            isNew: false,
            blocks: blocksWithText,
        });
    } catch (error) {
        console.error('ブログ詳細の取得に失敗しました:', error);
        return NextResponse.json({ error: 'ブログ詳細の取得に失敗しました' }, { status: 500 });
    }
}
