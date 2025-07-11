'use client'

import FaqItem from './FaqItem'
import {FaqCategoryName} from '@/lib/constants'
import {fetchFaqDetail} from "@/lib/server/faq";
import {FaqCategoryArray} from "@/lib/constants";
import {RichText} from '@/types/notion';

type FaqListProps = {
    faqs: Array<{
        id: string;
        question: string;
        answer: string;
        answer_rich_text?: RichText[];
        show_blocks: boolean;
        category: FaqCategoryName[];
    }>;
    categories?: ReadonlyArray<{
        readonly name: FaqCategoryName;
        readonly path: string;
    }>;
    apiUrl?: string; // APIのURLを渡す
}

export default function FaqList({
                                    faqs,
                                    categories = FaqCategoryArray // デフォルト値として定数を使用
                                }: FaqListProps) {
    return (
        <div className="space-y-12">
            {categories.map((category) => {
                // このカテゴリーに属するFAQ項目をフィルタリング
                const categoryFaqs = faqs.filter(faq =>
                    faq.category.includes(category.name)
                );

                // カテゴリーに属する項目がない場合は表示しない
                if (categoryFaqs.length === 0) return null;

                return (
                    <div key={category.path} id={category.path} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-blue-700 border-b pb-2">{category.name}</h2>
                        <div className="space-y-4">
                            {categoryFaqs.map((faq) => (
                                <FaqItem
                                    key={faq.id}
                                    id={faq.id}
                                    question={faq.question}
                                    summary={faq.answer}
                                    answerRichText={faq.answer_rich_text}
                                    showBlocks={faq.show_blocks}
                                    fetchDetail={fetchFaqDetail}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    )
} 