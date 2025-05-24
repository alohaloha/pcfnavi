import { Metadata } from "next";

export const metadata: Metadata = {
  title: "カレンダー | PCF NAVI",
  description: "PCF NAVIのイベントカレンダーです。",
  openGraph: {
    title: "カレンダー | PCF NAVI",
    description: "PCF NAVIのイベントカレンダーです。",
    images: ["/images/ogp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "カレンダー | PCF NAVI",
    description: "PCF NAVIのイベントカレンダーです。",
    images: ["/images/ogp.jpg"],
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 