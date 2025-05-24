import { Metadata } from "next";

export const metadata: Metadata = {
  title: "カレンダー | 電くるなび",
  description: "電くるなびのイベントカレンダーです。",
  openGraph: {
    title: "カレンダー | 電くるなび",
    description: "電くるなびのイベントカレンダーです。",
    images: ["/images/ogp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "カレンダー | 電くるなび",
    description: "電くるなびのイベントカレンダーです。",
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