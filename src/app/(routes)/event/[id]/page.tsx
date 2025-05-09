import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetail } from '@/types/event';
import { getEventDetailFromSupabase } from '@/lib/server/event';
import { EventDetailView } from '@/components/event/EventDetailView';

interface EventDetailPageProps {
    params: {
        id: string;
    };
}

export const revalidate = 3600; // 1時間ごとに再検証

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
    const event = await getEventDetailFromSupabase(params.id);
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
            images: event.cover ? [event.cover] : [],
        },
    };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const event = await getEventDetailFromSupabase(params.id);
    if (!event) {
        notFound();
    }

    return <EventDetailView event={event} />;
} 