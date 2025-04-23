import { Section } from "@/components/Section";
import FaqItem from "@/components/FaqItem";
import { fetchFaqList } from "@/lib/faq";
import { FAQ_CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "よくある質問 | PCF Navi",
  description: "パワーチェアフットボールに関するよくある質問",
};

export default async function FaqPage() {
  const faqList = await fetchFaqList();

  return (
    <Section className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-800">よくある質問</h1>
        
        <div className="space-y-12">
          {FAQ_CATEGORIES.map((category) => {
            // このカテゴリーに属するFAQ項目をフィルタリング
            const categoryFaqs = faqList.filter(faq => 
              faq.category.includes(category.name)
            );
            
            // カテゴリーに属する項目がない場合は表示しない
            if (categoryFaqs.length === 0) return null;
            
            return (
              <div key={category.path} id={category.path} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-700 border-b pb-2">{category.name}</h2>
                <div className="space-y-4">
                  {categoryFaqs.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
} 