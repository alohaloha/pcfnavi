import { Metadata } from 'next';
import { getEventListFromSupabase } from '@/lib/server/event';
import { EventList } from '@/components/event/EventList';
import { EventModal } from '@/components/event/EventModal';

export const metadata: Metadata = {
    title: 'イベント | PCF NAVI',
    description: '電動車椅子サッカーに関するイベント情報をご紹介します。',
};

// ISRの設定（1時間ごとに再生成）
export const revalidate = 3600;

export default async function EventsPage() {
    const events = await getEventListFromSupabase();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">イベント一覧</h1>
            <EventList events={events} />
            <EventModal />
        </div>
    );
} 