import {Section} from "@/components/Section";
import Image from "next/image";

export const metadata = {
    title: "ルール | 電くるなび",
    description: "パワーチェアフットボールのルールについて説明します",
    openGraph: {
        title: "ルール | 電くるなび",
        description: "パワーチェアフットボールのルールについて説明します",
        images: ["/images/ogp.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "ルール | 電くるなび",
        description: "パワーチェアフットボールのルールについて説明します",
        images: ["/images/ogp.jpg"],
    },
};

export default function RulesPage() {
    return (
        <Section>
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <Image
                            src="/images/rules/sp_p1.svg"
                            alt="ゴールキーパーは、ペナルティーエリアから出なければ2on1にならない特権がある"
                            width={500}
                            height={400}
                            className="w-full max-w-md mb-4"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/rules/sp_p2.svg"
                            alt="ペナルティーエリアの中はゴールキーパーを含む2人で守ることができる"
                            width={500}
                            height={400}
                            className="w-full max-w-md mb-4"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/rules/sp_p3.svg"
                            alt="味方が3人以上入っちゃダメ"
                            width={500}
                            height={400}
                            className="w-full max-w-md mb-4"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/images/rules/sp_p4.svg"
                            alt="パワーチェアフットボールのルール"
                            width={500}
                            height={400}
                            className="w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
            <div className="text-right mt-8 text-gray-500">
                Special Thanks to yuzupon@<a href="https://www.facebook.com/profile.php?id=61561233526857" className="text-blue-500">蹴覧音2025</a>
            </div>
        </Section>
    );
}
