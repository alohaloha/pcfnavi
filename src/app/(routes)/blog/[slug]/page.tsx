import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogDetail, fetchBlogList } from '@/lib/blog';
import BlogDetail from '@/components/BlogDetail';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const blog = await fetchBlogDetail(slug);
  
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
  
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = params;
  const blog = await fetchBlogDetail(slug);
  
  if (!blog.title) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <BlogDetail blog={blog} />
    </main>
  );
} 