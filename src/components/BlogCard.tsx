'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {BlogItem} from '@/lib/server/blog';

interface BlogCardProps {
    blog: BlogItem;
}

export default function BlogCard({blog}: BlogCardProps) {
    return (
        <Link href={`/blog/${blog.id}`} className="block h-full">
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-[1.02] hover:shadow-lg flex flex-col">
                <div className="relative h-48 w-full">
                    {blog.cover ? (
                        <Image
                            src={blog.cover}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                    {blog.isNew && (
                        <div
                            className="absolute top-3 right-3 bg-red-400 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm backdrop-filter opacity-90 transform transition-all duration-300 hover:scale-105">
                            NEW
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1 mb-2">
                        {Array.isArray(blog.category) && blog.category.length > 0 ? (
                            blog.category.map((cat, index) => (
                                <span
                                    key={`${cat}-${index}`}
                                    className="inline-block bg-cta text-xs px-2 py-1 rounded shadow-sm"
                                >
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="inline-block bg-secondary text-primary text-xs px-2 py-1 rounded">
                                カテゴリなし
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {blog.summary}
                    </p>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">公開日：
                        {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
                    </span>
                    {blog.featured && (
                        <span className="text-xs text-amber-600 font-medium">
                            ⭐ 注目記事
                        </span>
                    )}
                </div>
                {/* <p className="text-gray-500 text-sm px-4 pb-3 text-right">公開日：<RelativeTime date={new Date(blog.publishedAt)} /></p> */}
            </div>
        </Link>
    );
} 