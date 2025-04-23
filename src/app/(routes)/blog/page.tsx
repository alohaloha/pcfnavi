import { Section } from "@/components/Section";
import { Grid } from "@/components/Grid";

export const metadata = {
  title: "ブログ | PCF Navi",
  description: "パワーチェアフットボールに関する最新記事",
};

export default function BlogPage() {
  return (
    <Section>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">ブログ</h1>
      <Grid cols={3} gap={6} className="mt-8">
        {/* ここにブログカードが入ります */}
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-gray-200">
            {/* サムネイル画像 */}
          </div>
          <div className="p-4">
            <h2 className="font-bold text-xl mb-2">記事タイトル</h2>
            <p className="text-gray-600 mb-2">2024年4月19日</p>
            <p className="line-clamp-3">記事の要約がここに入ります。</p>
          </div>
        </div>
        {/* 他のブログカード */}
      </Grid>
    </Section>
  );
} 