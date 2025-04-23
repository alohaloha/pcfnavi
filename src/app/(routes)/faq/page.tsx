import { Section } from "@/components/Section";

export const metadata = {
  title: "よくある質問 | PCF Navi",
  description: "パワーチェアフットボールに関するよくある質問",
};

export default function FaqPage() {
  return (
    <Section>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">よくある質問</h1>
      <div className="space-y-6">
        {/* ここにFAQアイテムが入ります */}
        <div className="border-b pb-4">
          <h2 className="font-bold text-xl mb-2">質問</h2>
          <p>回答がここに入ります。</p>
        </div>
        {/* 他のFAQアイテム */}
      </div>
    </Section>
  );
} 