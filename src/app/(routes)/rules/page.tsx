import { Section } from "@/components/Section";

export const metadata = {
  title: "ルール | PCF Navi",
  description: "パワーチェアフットボールのルールについて説明します",
};

export default function RulesPage() {
  return (
    <Section>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">ルール</h1>
      <div className="prose max-w-none">
        <p>ここにパワーチェアフットボールのルールについての説明が入ります。</p>
      </div>
    </Section>
  );
} 