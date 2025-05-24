'use client'

import React from 'react'

interface Block {
    id: string;
    type: string;
    rich_texts: any[];
    has_children: boolean;
    children?: Block[];
    imageSrc?: string;
    captionText?: string;
    captionHtml?: string;
    cloudflare_key?: string;
    order?: number;
}

function sortBlocks(blocks: Block[]): Block[] {
    return [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function renderRichText(text: any, key: number): React.ReactNode {
    const { plain_text, href } = text;
    if (href) {
        return (
            <a key={key} href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {plain_text}
            </a>
        );
    }
    return <span key={key}>{plain_text}</span>;
}

function renderBlocks(blocks: Block[], depth = 0, parentId?: string): React.ReactNode[] {
    const sortedBlocks = sortBlocks(blocks);
    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < sortedBlocks.length) {
        const block = sortedBlocks[i];
        const uniqueKey = parentId ? `${parentId}-${block.id}` : block.id;
        const indentClass = depth > 0 ? 'ml-8' : '';

        // リストグループ化
        if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
            const listType = block.type === 'bulleted_list_item' ? 'ul' : 'ol';
            const items: Block[] = [];
            const listStartIndex = i;
            while (
                i < sortedBlocks.length &&
                sortedBlocks[i].type === block.type
            ) {
                items.push(sortedBlocks[i]);
                i++;
            }
            result.push(
                React.createElement(
                    listType,
                    { key: `${uniqueKey}-list-${depth}-${listStartIndex}`, className: `mb-2 ${indentClass}` },
                    items.map((item, idx) => (
                        <li
                            key={`${uniqueKey}-${item.id}-${depth}-${listStartIndex + idx}-li-${i}-${Math.random()}`}
                            className={listType === 'ul' ? 'list-disc ml-6' : 'list-decimal ml-6'}
                        >
                            {(item.rich_texts ?? []).map((text, tIdx) => renderRichText(text, tIdx))}
                            {item.has_children && item.children && item.children.length > 0 && (
                                renderBlocks(item.children, depth + 1, `${uniqueKey}-${item.id}-${depth}-${listStartIndex + idx}-li`)
                            )}
                        </li>
                    ))
                )
            );
            continue;
        }

        // 通常ブロック
        switch (block.type) {
            case 'paragraph':
                result.push(
                    <p key={uniqueKey} className={`mb-4 text-gray-700 ${indentClass}`}>
                        {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                        {block.has_children && block.children && block.children.length > 0 && (
                            renderBlocks(block.children, depth + 1, uniqueKey)
                        )}
                    </p>
                );
                break;
            case 'heading_1':
                result.push(
                    <h1 key={uniqueKey} className={`text-2xl font-bold mb-4 mt-6 ${indentClass}`}>
                        {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                    </h1>
                );
                break;
            case 'heading_2':
                result.push(
                    <h2 key={uniqueKey} className={`text-xl font-bold mb-3 mt-5 ${indentClass}`}>
                        {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                    </h2>
                );
                break;
            case 'heading_3':
                result.push(
                    <h3 key={uniqueKey} className={`text-lg font-bold mb-2 mt-4 ${indentClass}`}>
                        {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                    </h3>
                );
                break;
            case 'quote':
                result.push(
                    <blockquote key={uniqueKey} className={`border-l-4 border-gray-300 pl-4 my-4 italic ${indentClass}`}>
                        {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                        {block.has_children && block.children && block.children.length > 0 && (
                            renderBlocks(block.children, depth + 1, uniqueKey)
                        )}
                    </blockquote>
                );
                break;
            case 'divider':
                result.push(<hr key={uniqueKey} className="my-6 border-t border-gray-200" />);
                break;
            case 'image':
                const imageUrl = block.cloudflare_key ? `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${block.cloudflare_key}/public` : block.imageSrc;
                result.push(
                    <div key={uniqueKey} className={`my-4 ${indentClass}`}>
                        {imageUrl && (
                            <img 
                                src={imageUrl} 
                                alt={block.captionText || block.type} 
                                className="max-w-full h-auto rounded-lg"
                            />
                        )}
                        {block.captionHtml && (
                            <div 
                                className="text-sm text-gray-600 mt-2" 
                                dangerouslySetInnerHTML={{ __html: block.captionHtml }} 
                            />
                        )}
                    </div>
                );
                break;
            case 'toggle':
                result.push(
                    <details key={uniqueKey} className={`mb-4 ${indentClass}`}>
                        <summary className="cursor-pointer font-medium">
                            {(block.rich_texts ?? []).map((text, idx) => renderRichText(text, idx))}
                        </summary>
                        {block.has_children && block.children && block.children.length > 0 && (
                            <div className="mt-2 pl-4">
                                {renderBlocks(block.children, depth + 1, uniqueKey)}
                            </div>
                        )}
                    </details>
                );
                break;
            default:
                result.push(<div key={uniqueKey}>Unsupported block type: {block.type}</div>);
        }
        i++;
    }
    return result;
}

export function parseEventBlocks(blocks: Block[]): React.ReactNode[] {
    if (!Array.isArray(blocks)) return [];
    return renderBlocks(blocks);
} 