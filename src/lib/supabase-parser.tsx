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
}

export function parseSupabaseBlocks(blocks: Block[]): React.ReactNode[] {
    if (!Array.isArray(blocks)) return [];

    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < blocks.length) {
        const block = blocks[i];
        const blockId = block.id;

        const renderTexts = (texts: any[]) =>
            (texts ?? []).map((text, i) => renderRichText(text, i));

        const renderBlock = (block: Block, depth: number = 0, index: number = 0) => {
            const indentClass = depth > 0 ? 'ml-8' : '';
            const uniqueKey = `${block.id}-${depth}-${index}`;
            switch (block.type) {
                case 'paragraph':
                    return (
                        <p key={uniqueKey} className={`mb-4 text-gray-700 ${indentClass}`}>
                            {renderTexts(block.rich_texts)}
                        </p>
                    );
                case 'heading_1':
                    return (
                        <h1 key={uniqueKey} className={`text-2xl font-bold mb-4 mt-6 ${indentClass}`}>
                            {renderTexts(block.rich_texts)}
                        </h1>
                    );
                case 'heading_2':
                    return (
                        <h2 key={uniqueKey} className={`text-xl font-bold mb-3 mt-5 ${indentClass}`}>
                            {renderTexts(block.rich_texts)}
                        </h2>
                    );
                case 'heading_3':
                    return (
                        <h3 key={uniqueKey} className={`text-lg font-bold mb-2 mt-4 ${indentClass}`}>
                            {renderTexts(block.rich_texts)}
                        </h3>
                    );
                case 'quote':
                    return (
                        <blockquote key={uniqueKey} className={`border-l-4 border-gray-300 pl-4 my-4 italic ${indentClass}`}>
                            {renderTexts(block.rich_texts)}
                            {block.has_children && block.children && (
                                <div className="mt-2">
                                    {parseSupabaseBlocks(block.children)}
                                </div>
                            )}
                        </blockquote>
                    );
                case 'divider':
                    return <hr key={uniqueKey} className="my-6 border-t border-gray-200" />;
                case 'image':
                    return (
                        <div key={uniqueKey} className={`my-4 ${indentClass}`}>
                            <img src={block?.imageSrc} alt={block.captionText || block.type} />
                            {block.captionHtml !== null && (
                                <span className="text-sm" dangerouslySetInnerHTML={{ __html: block.captionHtml || '' }} />
                            )}
                        </div>
                    );
                case 'toggle':
                    return (
                        <details key={uniqueKey} className={`mb-4 ${indentClass}`}>
                            <summary className="cursor-pointer font-medium">
                                {renderTexts(block.rich_texts)}
                            </summary>
                            {block.has_children && block.children && (
                                <div className="mt-2 pl-4">
                                    {parseSupabaseBlocks(block.children)}
                                </div>
                            )}
                        </details>
                    );
                default:
                    return <div key={uniqueKey}>Unsupported block type: {block.type}</div>;
            }
        };

        // リストアイテムのグループ化
        if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
            const listType = block.type === 'bulleted_list_item' ? 'ul' : 'ol';
            const items: Block[] = [];
            const startIndex = i;
            while (
                i < blocks.length &&
                blocks[i].type === block.type
            ) {
                items.push(blocks[i]);
                i++;
            }
            result.push(
                React.createElement(
                    listType,
                    { key: `${listType}-${startIndex}` },
                    items.map((item, idx) => (
                        <li key={`${item.id}-${idx}`} className={listType === 'ul' ? 'ml-6 mb-2 list-disc' : 'ml-6 mb-2 list-decimal'}>
                            {renderTexts(item.rich_texts)}
                            {item.has_children && item.children && (
                                <div className="mt-2">
                                    {parseSupabaseBlocks(item.children)}
                                </div>
                            )}
                        </li>
                    ))
                )
            );
            continue;
        }

        // 通常ブロック
        result.push(renderBlock(block, 0, i));
        i++;
    }
    return result;
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
