import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/types/event';
import { getEventDetailFromSupabase, getEventListFromSupabase } from '@/lib/server/event';
import { EventDetailView } from '@/components/event/EventDetailView';
import { headers } from 'next/headers';

interface Params {
    id: string;
}

export const revalidate = 3600; // 1時間ごとに再検証

export async function generateStaticParams() {
    const events = await getEventListFromSupabase();
    return events.map((event) => ({
        id: event.id,
    }));
}

export async function generateMetadata({ params }: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { id } = await params;
    const event = await getEventDetailFromSupabase(id);
    // リクエストヘッダからホスト名を取得
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const siteUrl = host ? `${protocol}://${host}` : '';
    const ogImage = event?.cover ? event.cover : `${siteUrl}/images/ogp.png`;
    if (!event) {
        return {
            title: 'イベントが見つかりません',
            description: '指定されたイベントは存在しないか、削除された可能性があります。',
        };
    }
    return {
        title: event.title,
        description: event.summary,
        openGraph: {
            title: event.title,
            description: event.summary,
            images: [ogImage],
        },
    };
}

export default async function EventDetailPage({ params }: {
    params: Promise<Params>;
}) {
    const { id } = await params;
    const event = await getEventDetailFromSupabase(id);
    if (!event) {
        notFound();
    }
    return <EventDetailView event={event} />;
} 