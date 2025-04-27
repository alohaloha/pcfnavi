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
    title: 'PCF Naviについて',
    description: 'PCF Naviの公式サイトの説明ページです。',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">PCF Naviについて</h1>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-2"/>
                    PCF Naviに込めた想い
                </h2>
                <p className="mt-3">
                    この場所をつくるまでに、実は何年も時間がかかりました。
                    やりたいことははっきりしていたのに、どうやって進めればいいかわからなかったり、
                    立場や役割に縛られて、自分の声が出せなかったり──
                    そんな時期もたくさんありました。
                </p>
                <p className="mt-3">
                    でも今は、少しだけ勇気が出てきました。
                </p>
                <p className="mt-3">
                    ここでは、自分が「やりたい」と思うことを、いちばん素直に、いちばん楽しめる方法でやってみたい。
                    それが誰かのきっかけやつながりになったら、もっと嬉しい。
                    そんな気持ちで、PCF Naviを立ち上げました。
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
                        <span
                            className="block">どんなルール？どこでやってるの？体験できる？のような初めての方が誰しも抱く疑問にお答えしたい。</span>
                    </li>
                    <li>
                        <span className="font-bold flex items-center">
                            <Globe className="mr-3"/>
                            最新情報にアクセスする</span>
                        <span
                            className="block">色んなサイトやSNSを横断して調べた大会情報やイベントのお知らせなどをまとめたい。</span>
                    </li>
                    <li>
                        <span className="font-bold flex items-center">
                            <LucideMessageCircleQuestion className="mr-3"/>
                            リアルな声にふれる</span>
                        <span
                            className="block">選手・スタッフ・支える人たちの声も取り上げたい。</span>
                    </li>
                    <li>
                        <span className="font-bold flex items-center">
                            <Music4 className="mr-3"/>
                            妄想・未来予想図を楽しむ</span>
                        <span className="block">「こんな未来がきたらいいな」という自由な発想を皆で楽しみたい。</span>
                    </li>
                </ul>
                <p className="mt-3">
                    色んな人の心の中にある希望や妄想を、一緒に少しずつ形にしていって、この競技がもっと楽しく盛り上がるきっかけになれば嬉しいです。
                </p>
                <p className="mt-3">ご協力、よろしくお願いします。</p>
            </section>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sparkles className="h-6 w-6 text-yellow-500 mr-2"/>
                    大切にしたいこと
                </h2>
                <ul className="list-none pl-5">
                    <li className="mb-2 flex items-center"><Heart className="mr-3"/>否定しないこと
                    </li>
                    <li className="mb-2 flex items-center"><Heart className="mr-3"/>自由に語れること
                    </li>
                    <li className="mb-2 flex items-center"><Heart className="mr-3"/>"まんなか"にいる人たちの声を尊重すること
                    </li>
                    <li className="mb-2 flex items-center"><Heart className="mr-3"/>小さなつながりを育てること
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
                    <Link href="https://forms.gle/ULgwcr2wqbVSLv9Q6"
                          className="text-accent font-bold underline">お問合せフォーム</Link>からご連絡ください。
                </p>
            </section>
        </main>
    );
} 