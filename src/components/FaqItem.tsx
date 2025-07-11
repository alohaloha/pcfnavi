import {useState} from 'react'
import {ChevronDown} from 'lucide-react'
import {FaqDetail} from '@/lib/server/faq'
import {parseNotionBlocks} from '@/lib/notionParser'
import {RichText, NotionBlock} from '@/types/notion'

// renderRichText関数を追加
function renderRichText(text: RichText, key: number): React.ReactNode {
    const {annotations, plain_text, href} = text;
    const {bold, italic, strikethrough, underline, code} = annotations || {};

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

    return className ? <span key={key} className={className}>{plain_text}</span> : <span key={key}>{plain_text}</span>;
}

type FaqItemProps = {
    id: string;
    question: string;
    summary: string;
    answerRichText?: RichText[];
    showBlocks: boolean;
    fetchDetail: (id: string) => Promise<FaqDetail>;
}

export default function FaqItem({id, question, summary, answerRichText, showBlocks, fetchDetail}: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [detailBlocks, setDetailBlocks] = useState<NotionBlock[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    if (id === '1de9c5c1-735d-8140-a1aa-d2091668bd14') console.log({ id, showBlocks});

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
            const {blocks} = await fetchDetail(id)
            setDetailBlocks(blocks)
            setShowDetail(true)
        } catch (error) {
            console.error('Failed to fetch details:', error)
        } finally {
            setIsLoading(false)
        }
    }

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
                    <div className="text-gray-700 mb-4">
                        {answerRichText && answerRichText.length > 0 ? (
                            answerRichText.map((text: RichText, i: number) => renderRichText(text, i))
                        ) : (
                            <span>{summary}</span>
                        )}
                    </div>

                    {/* 詳細表示ボタンとロード中表示 */}
                    <div className="flex items-center space-x-4">
                        {!showDetail && showBlocks && (
                            <button
                                onClick={handleFetchDetail}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-sm"
                                disabled={isLoading}
                            >
                                もっと見る
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