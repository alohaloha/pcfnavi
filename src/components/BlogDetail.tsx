'use client'

import React from 'react';
import Image from 'next/image';
import { parseNotionBlocks } from '@/lib/notionParser';
import type { BlogDetail } from '@/lib/blog';

interface BlogDetailProps {
  blog: BlogDetail;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const formattedDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {blog.cover && (
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.category.map((cat) => (
            <span 
              key={cat} 
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{blog.title}</h1>
        
        <div className="text-gray-500 mb-6">
          {formattedDate}
        </div>
        
        <div className="prose prose-blue max-w-none">
          {parseNotionBlocks(blog.blocks)}
        </div>
      </div>
    </article>
  );
} 