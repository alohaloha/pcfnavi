import { Section } from "@/components/Section";
import { Grid } from "@/components/Grid";

export const metadata = {
  title: "イベント | PCF Navi",
  description: "パワーチェアフットボールの大会やイベント情報",
};

export default function EventsPage() {
  return (
    <Section>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">イベント</h1>
      <Grid cols={3} gap={6}>
        {/* ここにイベントカードが入ります */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="font-bold text-xl mb-2">イベント名</h2>
          <p className="text-gray-600 mb-2">2024年5月1日</p>
          <p>イベントの説明文がここに入ります。</p>
        </div>
        {/* 他のイベントカード */}
      </Grid>
    </Section>
  );
} 