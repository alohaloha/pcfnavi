'use client'

import React from 'react'

type NotionBlock = {
  type: string;
  id: string;
  [key: string]: any;
};

export function parseNotionBlocks(blocks: NotionBlock[]): React.ReactNode[] {
  return blocks.map((block, index) => {
    const blockId = block.id;
    
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={blockId} className="mb-4 text-gray-700">
            {block.paragraph.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </p>
        );
        
      case 'heading_1':
        return (
          <h1 key={blockId} className="text-2xl font-bold mb-4 mt-6">
            {block.heading_1.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </h1>
        );
        
      case 'heading_2':
        return (
          <h2 key={blockId} className="text-xl font-bold mb-3 mt-5">
            {block.heading_2.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </h2>
        );
        
      case 'heading_3':
        return (
          <h3 key={blockId} className="text-lg font-bold mb-2 mt-4">
            {block.heading_3.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </h3>
        );
        
      case 'bulleted_list_item':
        return (
          <li key={blockId} className="ml-6 mb-2 list-disc">
            {block.bulleted_list_item.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </li>
        );
        
      case 'numbered_list_item':
        return (
          <li key={blockId} className="ml-6 mb-2 list-decimal">
            {block.numbered_list_item.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </li>
        );
        
      case 'image':
        const imageUrl = block.image.type === 'external' 
          ? block.image.external.url 
          : block.image.file.url;
        
        return (
          <div key={blockId} className="my-4">
            <img 
              src={imageUrl} 
              alt={block.image.caption?.length > 0 ? block.image.caption[0].plain_text : 'Image'} 
              className="rounded-lg max-w-full"
            />
            {block.image.caption?.length > 0 && (
              <p className="text-sm text-gray-500 mt-1 text-center">
                {block.image.caption[0].plain_text}
              </p>
            )}
          </div>
        );
        
      case 'code':
        return (
          <pre key={blockId} className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">
            <code>
              {block.code.rich_text.map((text: any) => text.plain_text).join('')}
            </code>
          </pre>
        );
        
      case 'quote':
        return (
          <blockquote key={blockId} className="border-l-4 border-gray-300 pl-4 my-4 italic">
            {block.quote.rich_text.map((text: any, i: number) => renderRichText(text, i))}
          </blockquote>
        );
        
      case 'divider':
        return <hr key={blockId} className="my-6 border-t border-gray-200" />;
        
      default:
        return <div key={blockId}>Unsupported block type: {block.type}</div>;
    }
  });
}

function renderRichText(text: any, key: number): React.ReactNode {
  const { annotations, plain_text, href } = text;
  const { bold, italic, strikethrough, underline, code } = annotations;
  
  let className = '';
  if (bold) className += 'font-bold ';
  if (italic) className += 'italic ';
  if (strikethrough) className += 'line-through ';
  if (underline) className += 'underline ';
  
  if (code) {
    return <code key={key} className="bg-gray-100 px-1 rounded">{plain_text}</code>;
  }
  
  if (href) {
    return (
      <a key={key} href={href} className={`text-blue-600 hover:underline ${className}`} target="_blank" rel="noopener noreferrer">
        {plain_text}
      </a>
    );
  }
  
  return className ? <span key={key} className={className}>{plain_text}</span> : <>{plain_text}</>;
} 