import { Section } from "@/components/Section";
import { Grid } from "@/components/Grid";

export const metadata = {
  title: "ギャラリー | PCF Navi",
  description: "パワーチェアフットボールの写真や動画ギャラリー",
};

export default function GalleryPage() {
  return (
    <Section>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">ギャラリー</h1>
      <Grid cols={3} gap={4}>
        {/* ここに画像が入ります */}
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
          {/* 画像コンテンツ */}
        </div>
        {/* 他の画像 */}
      </Grid>
    </Section>
  );
} 