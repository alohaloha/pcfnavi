import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getEventListFromSupabase } from '@/lib/server/event';
import { EventListWithFilter } from '@/components/event/EventListWithFilter';
import { EventModal } from '@/components/event/EventModal';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const siteUrl = host ? `${protocol}://${host}` : '';
    return {
        title: 'イベント | 電くるなび',
        description: '電動車椅子サッカーの情報ポータルサイト',
        openGraph: {
            title: 'イベント | 電くるなび',
            description: '電動車椅子サッカーの情報ポータルサイト',
            images: [`${siteUrl}/images/ogp.jpg`],
        },
    };
}

// ISRの設定（1時間ごとに再生成）
export const revalidate = 3600;

export default async function EventsPage() {
    const events = await getEventListFromSupabase();

    return (
        <div className="container mx-auto px-4 py-8">
            <EventListWithFilter events={events} />
            <EventModal />
        </div>
    );
} 