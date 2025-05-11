import React from 'react';
import Link from "next/link"
import {Globe, Heart, LucideMessageCircleQuestion, MailIcon, Music4, Sparkles} from "lucide-react";

export const metadata = {
    title: '電くるなびについて',
    description: '電くるなびの公式サイトの説明ページです。',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">電くるなびについて</h1>

            <section className="mb-12 border-b-2 border-gray-300 pb-8">
                <p className="mt-3">
                    このサイトは、電動車椅子サッカー（Powerchair Football）をもっと知ってもらいたくて立ち上げました。
                    立ち上げたのは、ただの一ファンです。好きな気持ちを大切に、マイペースで更新しています。
                </p>
                <p className="mt-3">
                    気になったニュース、イベント情報など、私が知って欲しいことを中心に紹介していきます。
                </p>
                <p className="mt-3">
                    選手やスタッフのインタビューもやってみたいし、オンラインで一緒に観戦する企画なんかもできたら楽しそうです。<br/>
                    妄想はふくらむばかりですが、できることから少しずつ、実現していけたらと思っています。
                </p>
                <p className="mt-3">
                    完璧な情報サイトではないので、間違いや足りない情報があるかもしれません。<br/>
                    イベントや大会については、主催者にお問合せをお願いします。<br/>
                    もし気づいたことがあれば、ぜひ教えていただけるとうれしいです。<br/>
                </p>
                <p className="mt-3">
                    うまくできるかはわからないけど、ワクワクしながら、この世界のことを伝えていけたらいいなと思っています。<br/>
                    よかったら、またふらっと覗きににきてください。<br/>
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
                        いろんな情報にアクセスする
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
                        「こんな未来がきたらいいな」という自由な発想を楽しみたい。
                      </span>
                    </li>
                </ul>
                <p className="mt-3">
                    妄想を少しずつ形にしていって、この競技がもっと楽しく盛り上がるきっかけになれば嬉しいです。
                </p>
                <p className="mt-3">
                    一緒に楽しんでもらえたらさらに嬉しいです。
                </p>
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