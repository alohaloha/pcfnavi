import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Noto_Sans_JP, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['800'],  // 太いウェイトを使用
  display: 'swap',
  variable: '--font-rubik',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: true,
  variable: '--font-noto-sans-jp',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "電動車椅子サッカーの情報ポータルサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${inter.variable} ${rubik.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
      {process.env.NEXT_PUBLIC_SHOW_HEADER === "true" && <Header />}
        <div className="flex-1">
          {children}
        </div>
      {process.env.NEXT_PUBLIC_SHOW_HEADER === "true" && <Footer />}
      <Analytics />
      </body>
    </html>
  );
}
