import {Section} from "@/components/Section";
import FaqList from "@/components/FaqList";
import {fetchFaqList} from "@/lib/server/faq";

export const metadata = {
    title: "よくある質問 | 電くるなび",
    description: "パワーチェアフットボールに関するよくある質問",
    openGraph: {
        title: "よくある質問 | 電くるなび",
        description: "パワーチェアフットボールに関するよくある質問",
        images: ["/images/ogp.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "よくある質問 | 電くるなび",
        description: "パワーチェアフットボールに関するよくある質問",
        images: ["/images/ogp.png"],
    },
};

// ISRの設定（5分ごとに再生成）
export const revalidate = 300;

export default async function FaqPage() {
    const faqList = await fetchFaqList();

    return (
        <Section className="bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-800">よくある質問</h1>

                <FaqList
                    faqs={faqList}
                />
            </div>
        </Section>
    );
} 