'use client'

import {useState} from 'react'
import {ChevronDown} from 'lucide-react'

type FaqItemProps = {
    id: string;
    question: string;
    summary: string;
    fetchDetail: (id: string) => Promise<any[]>;
}

type NotionBlock = {
    type: string;
    id: string;
    [key: string]: any;
};

export default function FaqItem({id, question, summary, fetchDetail}: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [detailBlocks, setDetailBlocks] = useState<any[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showDetail, setShowDetail] = useState(false)

    // アコーディオンの開閉
    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    // 詳細を取得する
    const handleFetchDetail = async () => {
        if (detailBlocks) {
            // すでに取得済みなら表示状態のみ切り替え
            setShowDetail(true)
            return
        }

        setIsLoading(true)
        try {
            const blocks = await fetchDetail(id)
            setDetailBlocks(blocks)
            setShowDetail(true)
        } catch (error) {
            console.error('Failed to fetch details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // NotionブロックをReactコンポーネントに変換する関数
    const parseNotionBlocks = (blocks: NotionBlock[]) => {
        return blocks.map((block) => {
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

                default:
                    return <div key={blockId}>Unsupported block type: {block.type}</div>;
            }
        });
    };

    // リッチテキストを描画する補助関数
    const renderRichText = (text: any, key: number) => {
        const {annotations, plain_text, href} = text;
        const {bold, italic, strikethrough, underline, code} = annotations;

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
                <a key={key} href={href} className={`text-blue-600 hover:underline ${className}`} target="_blank"
                   rel="noopener noreferrer">
                    {plain_text}
                </a>
            );
        }

        return className ? <span key={key} className={className}>{plain_text}</span> : <>{plain_text}</>;
    };

    return (
        <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
            <button
                className={`flex w-full justify-between items-center text-left font-bold text-lg p-4 ${
                    isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={handleToggle}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <ChevronDown
                    className={`transition-transform duration-200 h-5 w-5 flex-shrink-0 text-blue-600 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="bg-gray-50 border-t p-4">
                    {/* 簡易回答 */}
                    <p className="text-gray-700 mb-4">{summary}</p>

                    {/* 詳細表示ボタンとロード中表示 */}
                    <div className="flex items-center space-x-4">
                        {!showDetail && (
                            <button
                                onClick={handleFetchDetail}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-sm"
                                disabled={isLoading}
                            >
                                詳しく見る
                            </button>
                        )}

                        {isLoading && (
                            <div className="flex items-center">
                                <div
                                    className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                                <span className="text-sm text-gray-600">読み込み中...</span>
                            </div>
                        )}
                    </div>

                    {/* 詳細コンテンツ (条件付きで表示) */}
                    {showDetail && detailBlocks && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="prose max-w-none">
                                {parseNotionBlocks(detailBlocks)}
                            </div>

                            {/* 詳細を閉じるボタン */}
                            <button
                                onClick={() => setShowDetail(false)}
                                className="mt-4 text-sm text-gray-600 hover:text-blue-600"
                            >
                                閉じる
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 