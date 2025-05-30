import React from 'react';
import { Metadata } from 'next';
import { fetchBlogList, getBlogListFromSupabase } from '@/lib/server/blog';
import BlogList from '@/components/BlogList';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const siteUrl = host ? `${protocol}://${host}` : '';
    return {
        title: 'ブログ | 電くるなび',
        description: '電動車椅子サッカーの情報ポータルサイト',
        openGraph: {
            title: 'ブログ | 電くるなび',
            description: '電動車椅子サッカーの情報ポータルサイト',
            images: [`${siteUrl}/images/ogp.png`],
        },
    };
}

export default async function BlogPage() {
    const blogs = await getBlogListFromSupabase();

    return (
        <main className="container mx-auto px-4 py-8">
            <BlogList blogs={blogs}/>
        </main>
    );
} 