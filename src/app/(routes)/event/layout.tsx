import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'イベント | PCF NAVI',
    description: '電動車椅子サッカーに関するイベント情報をご紹介します。',
};

// ISRの設定（1時間ごとに再生成）
export const revalidate = 3600;

export default function EventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 