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

  // デバッグ: カテゴリー情報を詳細に表示
  useEffect(() => {
    console.log('定義されているカテゴリ:', BLOG_CATEGORIES);
    
    // 受け取ったブログデータの詳細を表示
    console.log(`受け取ったブログ記事数: ${blogs.length}`);
    
    // 各ブログのカテゴリを表示
    blogs.forEach((blog, index) => {
      console.log(`ブログ[${index}] ID:${blog.id} - カテゴリ:`, 
        Array.isArray(blog.category) ? blog.category : '配列ではない');
    });
    
    // カテゴリの種類をまとめて表示
    const allCategories = blogs.flatMap(blog => blog.category || []);
    const uniqueCategories = [...new Set(allCategories)];
    console.log('ブログ記事に存在するカテゴリ一覧:', uniqueCategories);
  }, [blogs]);

  const handleCategoryFilter = (categoryName: string) => {
    console.log('選択したカテゴリー:', categoryName);
    setActiveCategory(categoryName);
    
    if (categoryName === 'all') {
      setFilteredBlogs(blogs);
      console.log('全ブログ表示:', blogs.length);
      return;
    }
    
    // デバッグ: 全記事のカテゴリを表示
    blogs.forEach((blog, index) => {
      console.log(`フィルタリング前のブログ[${index}] ID:${blog.id} カテゴリ:`, 
        Array.isArray(blog.category) ? blog.category : 'array以外', 
        blog.category);
    });
    
    // カテゴリでフィルタリング（デバッグ情報付き）
    const filtered = blogs.filter(blog => {
      // カテゴリが配列でない場合の対策
      if (!Array.isArray(blog.category)) {
        console.log(`ブログID ${blog.id}: カテゴリが配列ではありません`, blog.category);
        return false;
      }
      
      // 空配列の場合（カテゴリが未設定）はフィルタに含めない
      if (blog.category.length === 0) {
        console.log(`ブログID ${blog.id}: カテゴリが空配列です`);
        return false;
      }
      
      // カテゴリ名での一致を確認
      const hasCategory = blog.category.some(catName => {
        const matched = catName === categoryName;
        if (matched) {
          console.log(`ブログID ${blog.id}: カテゴリ「${categoryName}」に一致しました`);
        }
        return matched;
      });
      
      return hasCategory;
    });
    
    console.log(`カテゴリー「${categoryName}」に一致する記事数:`, filtered.length);
    console.log('フィルタリング結果:', filtered.map(b => b.id));
    setFilteredBlogs(filtered);
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
              ? 'bg-[var(--primary-custom)] text-white'
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
                ? 'bg-[var(--primary-custom)] text-white'
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