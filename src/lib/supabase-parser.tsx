'use client'

import React from 'react'

export function parseSupabaseBlocks(blocks: any[]): React.ReactNode[] {
    if (!Array.isArray(blocks)) return [];

    return blocks.map((block, index) => {
        const blockId = block.id;

        const renderTexts = (texts: any[]) =>
            (texts ?? []).map((text, i) => renderRichText(text, i));

        switch (block.type) {
            case 'paragraph':
                return (
                    <p key={blockId} className="mb-4 text-gray-700">
                        {renderTexts(block.rich_texts)}
                    </p>
                );

            case 'heading_1':
                return (
                    <h1 key={blockId} className="text-2xl font-bold mb-4 mt-6">
                        {renderTexts(block.rich_texts)}
                    </h1>
                );

            case 'heading_2':
                return (
                    <h2 key={blockId} className="text-xl font-bold mb-3 mt-5">
                        {renderTexts(block.rich_texts)}
                    </h2>
                );

            case 'heading_3':
                return (
                    <h3 key={blockId} className="text-lg font-bold mb-2 mt-4">
                        {renderTexts(block.rich_texts)}
                    </h3>
                );

            case 'bulleted_list_item':
                return (
                    <li key={blockId} className="ml-6 mb-2 list-disc">
                        {renderTexts(block.rich_texts)}
                    </li>
                );

            case 'numbered_list_item':
                return (
                    <li key={blockId} className="ml-6 mb-2 list-decimal">
                        {renderTexts(block.rich_texts)}
                    </li>
                );

            case 'quote':
                return (
                    <blockquote key={blockId} className="border-l-4 border-gray-300 pl-4 my-4 italic">
                        {renderTexts(block.rich_texts)}
                    </blockquote>
                );

            case 'divider':
                return <hr key={blockId} className="my-6 border-t border-gray-200" />;

            case 'image':
                return (
                    <div key={blockId} className="my-4">
                        <img src={block?.imageSrc} alt={block.captionText || block.type} />
                        {block.captionHtml !== null && (
                            <span className="text-sm" dangerouslySetInnerHTML={{ __html: block.captionHtml }} />
                        )}
                    </div>
                );
            default:
                return <div key={blockId}>Unsupported block type: {block.type}</div>;
        }
    });
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
