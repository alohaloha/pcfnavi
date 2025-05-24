import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getUpcomingEventsFromSupabase } from '@/lib/server/event';
import { getLatestBlogsFromSupabase } from '@/lib/server/blog';
import { HomePage } from '@/components/home/HomePage';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const siteUrl = host ? `${protocol}://${host}` : '';
    return {
        title: '電くるなび - 電動車椅子サッカーの情報ポータルサイト',
        description: '電動車椅子サッカーの情報ポータルサイト',
        openGraph: {
            title: '電くるなび - 電動車椅子サッカーの情報ポータルサイト',
            description: '電動車椅子サッカーの情報ポータルサイト',
            images: [`${siteUrl}/images/ogp.jpg`],
        },
        twitter: {
            card: 'summary_large_image',
            title: '電くるなび - 電動車椅子サッカーの情報ポータルサイト',
            description: '電動車椅子サッカーの情報ポータルサイト',
            images: [`${siteUrl}/images/ogp.jpg`],
        },
    };
}

// ISRの設定（1時間ごとに再生成）
export const revalidate = 3600;

export default async function Page() {
    const [upcomingEvents, latestBlogs] = await Promise.all([
        getUpcomingEventsFromSupabase(3),
        getLatestBlogsFromSupabase(3),
    ]);

    return (
        <main className="container mx-auto px-4 py-8">
            <HomePage
                upcomingEvents={upcomingEvents}
                latestBlogs={latestBlogs}
            />
        </main>
    );
}
