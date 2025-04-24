'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogItem } from '@/lib/blog';

interface BlogCardProps {
  blog: BlogItem;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <Link href={`/blog/${blog.slug}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform hover:scale-[1.02] hover:shadow-lg">
        <div className="relative h-48 w-full">
          {blog.cover ? (
            <Image
              src={blog.cover}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {blog.isNew && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {blog.category.map((cat) => (
              <span 
                key={cat} 
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {cat}
              </span>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {blog.summary}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{formattedDate}</span>
            {blog.featured && (
              <span className="text-amber-600 font-medium">注目記事</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 