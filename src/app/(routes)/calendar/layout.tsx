import { Metadata } from "next";

export const metadata: Metadata = {
  title: "カレンダー | PCF NAVI",
  description: "PCF NAVIのイベントカレンダーです。",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 