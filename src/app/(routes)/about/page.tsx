import React from 'react';
import {MaterialSymbolsStarShine} from "@/components/icon/MaterialSymbolsStarShine";
import {FeBeginner} from "@/components/icon/FeBegginer";
import Link from "next/link"
import {
    BookOpenIcon,
    HandshakeIcon,
    LucideHeartHandshake,
    MailIcon,
    StarIcon,
    Sparkles,
    Globe,
    LucideMessageCircleQuestion,
    Music4, Heart
} from "lucide-react";
import {IconParkOutlineSendEmail} from "@/components/icon/IconParkOutlineSendEmail";
import {MdiCardsHeartOutline} from "@/components/icon/MdiCardsHeartOutline";

export const metadata = {
    title: '電くるなびについて',
    description: '電くるなびの公式サイトの説明ページです。',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">電くるなびについて</h1>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-2"/>
                    電くるなびに込めた想い
                </h2>
                <p className="mt-3">
                    正直、最初は、こんなにすごい世界だとは思っていませんでした。
                </p>
                <p className="mt-3">
                    電動車椅子サッカーって、レクリエーションみたいなものだと思ってた。<br/>
                    でも実際に見たのは、試合に負けて本気で涙を流す選手たちの姿。<br/>
                    ストイックに練習を積み重ねて、練習後も何時間もサッカーの話を続ける姿。<br/>
                    壁を相手にひたすらボールを蹴り続ける姿。<br/>
                    ボロボロになりながらも笛がなる瞬間まで1点を取りに行く姿──
                </p>
                <p className="mt-3">
                    そこには、スポーツへの情熱も、覚悟も、想像していた何倍もの「本気」がありました。
                </p>
                <p className="mt-3">
                    福祉とスポーツ、アスリートと障害者。<br/>
                    いろんなものが複雑に混ざりあった世界だけど、<br/>
                    だからこそ、これって本当の共生なんじゃないかな──<br/>
                    そんなふうにも思っています。
                </p>
                <p className="mt-3">
                    やる人も、みる人も、ささえる人も。<br/>
                    それぞれが思い思いに生きられる場所を、もっとワクワクする世界にしたい。
                </p>
                <p className="mt-3">
                    電くるなびは、そんな私の「やってみたい！」という気持ちから始まりました。
                </p>
                <p className="mt-3">
                    うまくできるかはわからないけど、ワクワクしながら、この世界を伝えていきたいと思っています。
                </p>
                <p className="mt-3">
                    もし、「なんかわかるかも」って思ってくれたら、よかったら、一緒にワクワクしながら、この世界を広げていきませんか。
                </p>
                <p className="mt-3">
                    そして、ここをきっかけに、少しでも電動車椅子サッカーに興味を持ってもらえたら──<br/>
                    それだけでも、最高です。
                </p>
            </section>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-2"/>
                    このサイトでやりたいこと
                </h2>
                <ul className="list-none pl-5 space-y-4">
                    <li>
      <span className="font-bold flex items-center">
        <LucideMessageCircleQuestion className="mr-3"/>
        電動車椅子サッカーの基本を知る
      </span>
                        <span className="block">
        どんなルール？どこでやってるの？体験できる？のような初めての方が誰しも抱く疑問にお答えしたい。
      </span>
                    </li>
                    <li>
      <span className="font-bold flex items-center">
        <Globe className="mr-3"/>
        最新情報にアクセスする
      </span>
                        <span className="block">
        色んなサイトやSNSを横断して調べた大会情報やイベントのお知らせなどをまとめたい。
      </span>
                    </li>
                    <li>
      <span className="font-bold flex items-center">
        <LucideMessageCircleQuestion className="mr-3"/>
        リアルな声にふれる
      </span>
                        <span className="block">
        選手・スタッフ・支える人たちの声も取り上げたい。
      </span>
                    </li>
                    <li>
      <span className="font-bold flex items-center">
        <Music4 className="mr-3"/>
        妄想・未来予想図を楽しむ
      </span>
                        <span className="block">
        「こんな未来がきたらいいな」という自由な発想を皆で楽しみたい。
      </span>
                    </li>
                </ul>
                <p className="mt-3">
                    色んな人の心の中にある希望や妄想を、一緒に少しずつ形にしていって、この競技がもっと楽しく盛り上がるきっかけになれば嬉しいです。
                </p>
                <p className="mt-3">
                    一緒に楽しんでもらえたら嬉しいです。
                </p>
            </section>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-2"/>
                    大切にしたいこと
                </h2>
                <ul className="list-none pl-5">
                    <li className="mb-2 flex items-center">
                        <Heart className="mr-3"/>
                        否定しないこと
                    </li>
                    <li className="mb-2 flex items-center">
                        <Heart className="mr-3"/>
                        自由に語れること
                    </li>
                    <li className="mb-2 flex items-center">
                        <Heart className="mr-3"/>
                        "まんなか"にいる人たちの声を尊重すること
                    </li>
                    <li className="mb-2 flex items-center">
                        <Heart className="mr-3"/>
                        小さなつながりを育てること
                    </li>
                    <li className="mb-2 flex items-center">
                        <Heart className="mr-3"/>
                        ワクワクすること！
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <MailIcon className="h-6 w-6 text-red-500 mr-2"/>
                    お問い合わせについて
                </h2>
                <p>
                    ご質問、ご意見、ご要望などがありましたら、
                    <Link href="https://forms.gle/ULgwcr2wqbVSLv9Q6" className="text-accent font-bold underline">
                        お問合せフォーム
                    </Link>
                    からご連絡ください。
                </p>
            </section>
        </main>
    );
} 