import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {EventDate} from "@/types/event";
import { differenceInHours, differenceInMinutes, differenceInDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** 年月日（例: 2025年5月18日） */
const formatYMD = (d: Date) =>
    new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Tokyo",
    }).format(d);

/** 時分（例: 09:00） */
const formatHM = (d: Date) =>
    new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tokyo",
    }).format(d);

export function formatEventDate({start, end}: EventDate): string {
    // 1. 開始が無い → 未定
    if (!start) return "日付未定";
    const s = new Date(start);
    if (isNaN(s.getTime())) return "日付未定";

    // 2. 終了が無い・パース不可 → 開始のみ表示
    if (!end) return formatYMD(s);
    const e = new Date(end);
    if (isNaN(e.getTime())) return formatYMD(s);

    const sameY = s.getFullYear() === e.getFullYear();
    const sameM = s.getMonth() === e.getMonth();
    const sameD = s.getDate() === e.getDate();

    // 3. 同じ日
    if (sameY && sameM && sameD) {
        const startTime = formatHM(s);
        const endTime = formatHM(e);

        // (1) 時刻が違う → 2025年5月18日 09:00～17:30
        if (startTime !== endTime) {
            return `${formatYMD(s)} ${startTime}～${endTime}`;
        }
        // (2) 同じ時刻 → 2025年5月18日 09:00
        return `${formatYMD(s)} ${startTime}`;
    }

    // 4. 同じ月（例: 2025年5月18日～20日）
    if (sameY && sameM) {
        const mdEnd = new Intl.DateTimeFormat("ja-JP", {
            month: "long",
            day: "numeric",
            timeZone: "Asia/Tokyo",
        }).format(e);
        return `${formatYMD(s)}～${mdEnd}`;
    }

    // 5. それ以外 → フル表示
    return `${formatYMD(s)} 〜 ${formatYMD(e)}`;
}

export function formatPrice(price: number | null): string {
    if (price === null) return "－";
    if (price === 0) return "無料";
    return `¥${price.toLocaleString()}`;
}

/**
 * 日付をスマートにフォーマットする関数（最終更新日の表示に使用）
 * @param input
 */
export function formatSmartDate(input: Date | string): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    const now = new Date();

    const diffMinutes = differenceInMinutes(now, date);
    const diffHours = differenceInHours(now, date);
    const diffDays = differenceInDays(now, date);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffHours < 24) {
        if (diffMinutes < 60) {
            return `${diffMinutes}分前`;
        } else {
            return `${diffHours}時間前`;
        }
    } else if (diffDays < 7) {
        return `${diffDays}日前`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks}週間前`;
    } else if (diffMonths < 12) {
        return `${diffMonths}ヶ月前`;
    } else {
        return format(date, 'yy年MM月dd日 HH:mm', { locale: ja });
    }
}

