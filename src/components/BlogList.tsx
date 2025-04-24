'use client'

import React, { useState, useEffect } from 'react';
import { BlogItem } from '@/lib/blog';
import BlogCard from './BlogCard';
import { BLOG_CATEGORIES, BlogCategoryName } from '@/lib/constants';

interface BlogListProps {
  blogs: BlogItem[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const [filteredBlogs, setFilteredBlogs] = useState<BlogItem[]>(blogs);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter(blog => blog.category.includes(category as BlogCategoryName))
      );
    }
  };

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        
        {BLOG_CATEGORIES.map((category) => (
          <button
            key={category.key}
            onClick={() => handleCategoryFilter(category.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              activeCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">該当する記事がありません</p>
        </div>
      )}
    </div>
  );
} 