import React from 'react';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {fetchBlogDetail, fetchBlogList} from '@/lib/server/blog';
import BlogDetail from '@/components/BlogDetail';

interface Params {
    id: string;
}

export async function generateMetadata({params,}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const {id} = await params;
    const blog = await fetchBlogDetail(id);

    if (!blog.title) {
        return {
            title: 'ブログ記事が見つかりません | PCF NAVI',
            description: '指定されたブログ記事は存在しないか、削除された可能性があります。',
        };
    }

    return {
        title: `${blog.title} | PCF NAVI`,
        description: blog.summary,
        openGraph: {
            title: blog.title,
            description: blog.summary,
            images: blog.cover ? [blog.cover] : [],
        },
    };
}

export async function generateStaticParams() {
    const blogs = await fetchBlogList();

    return Array.isArray(blogs)
        ? blogs.map((blog) => ({id: blog.id}))
        : [];
}

export default async function BlogDetailPage({params,}: {
    params: Promise<Params>;
}) {
    const {id} = await params;
    const blog = await fetchBlogDetail(id);
    console.log({blog});

    if (!blog.title) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <BlogDetail blog={blog}/>
        </main>
    );
}
