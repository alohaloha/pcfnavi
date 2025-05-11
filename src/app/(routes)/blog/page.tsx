import React from 'react';
import {Metadata} from 'next';
import {fetchBlogList, getBlogListFromSupabase} from '@/lib/server/blog';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
    title: 'ブログ | 電くるなび',
    description: '電動車椅子サッカーに関する最新情報や役立つ記事をご紹介します。',
};

export default async function BlogPage() {
    const blogs = await getBlogListFromSupabase();

    return (
        <main className="container mx-auto px-4 py-8">
            <BlogList blogs={blogs}/>
        </main>
    );
} 