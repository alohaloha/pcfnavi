import React from 'react';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {fetchBlogDetail, fetchBlogList, getBlogDetailFromSupabase, getBlogListFromSupabase} from '@/lib/server/blog';
import BlogDetail from '@/components/BlogDetail';

interface Params {
    id: string;
}
export const revalidate = 300; // ← 5分後以降の初アクセスで再生成

console.log("✅ page.tsx レンダリングされました"); // ←これが出れば成功

export async function generateMetadata({params,}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const {id} = await params;
    const blog = await getBlogDetailFromSupabase(id);

    if (!blog?.title) {
        return {
            title: 'ブログ記事が見つかりません | 電くるなび',
            description: '指定されたブログ記事は存在しないか、削除された可能性があります。',
        };
    }

    return {
        title: `${blog.title} | 電くるなび`,
        description: blog.summary,
        openGraph: {
            title: blog.title,
            description: blog.summary,
            images: blog.cover ? [blog.cover] : [],
        },
    };
}

export async function generateStaticParams() {
    const blogs = await getBlogListFromSupabase();

    return Array.isArray(blogs)
        ? blogs.map((blog) => ({id: blog.id}))
        : [];
}

export default async function BlogDetailPage({params,}: {
    params: Promise<Params>;
}) {
    const {id} = await params;
    const blog = await getBlogDetailFromSupabase(id);

    if (!blog?.title) {
        notFound();
    }
    console.log('BlogDetailPage', {cover: blog.cover, title: blog.title});

    return (
        <main className="container mx-auto px-4 py-8">
            <BlogDetail blog={blog}/>
        </main>
    );
}
