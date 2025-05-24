'use client';

import React from 'react';
import { EventItem } from '@/types/event';
import { BlogItem } from '@/lib/server/blog';
import { EventList } from '@/components/event/EventList';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { CircleChevronRight } from 'lucide-react';

interface HomePageProps {
    upcomingEvents: EventItem[];
    latestBlogs: BlogItem[];
}

export function HomePage({ upcomingEvents, latestBlogs }: HomePageProps) {
    return (
        <div className="space-y-12">
            {/* イベントセクション */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">今後のイベント</h2>
                    <Link href="/event" className="group text-primary inline-flex items-center gap-1">
                        <CircleChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                        <span className="group-hover:underline">もっと見る</span>
                    </Link>
                </div>
                <EventList events={upcomingEvents} />
            </section>

            {/* ブログセクション */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">最新のブログ</h2>
                    <Link href="/blog" className="group text-primary inline-flex items-center gap-1">
                        <CircleChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                        <span className="group-hover:underline">もっと見る</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestBlogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </section>
        </div>
    );
} 