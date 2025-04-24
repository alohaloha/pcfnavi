'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {BlogItem} from '@/lib/blog';

interface BlogCardProps {
    blog: BlogItem;
}

export default function BlogCard({blog}: BlogCardProps) {
    const formattedDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';
    return (
        <Link href={`/blog/${blog.slug}`} className="block h-full">
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-[1.02] hover:shadow-lg">
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
                            className="absolute top-3 right-3 bg-gradient-to-r from-[var(--ruby)] to-[var(--coral)] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm backdrop-filter opacity-90 transform transition-all duration-300 hover:scale-105">
                            NEW
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                        {Array.isArray(blog.category) && blog.category.length > 0 ? (
                            blog.category.map((cat, index) => (
                                <span
                                    key={`${cat}-${index}`}
                                    className="inline-block bg-cream text-primary text-xs px-2 py-1 rounded"
                                >
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                                カテゴリなし
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {blog.summary}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{formattedDate}</span>
                        {blog.featured && (
                            <span className="text-accent font-medium">注目記事</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
} 