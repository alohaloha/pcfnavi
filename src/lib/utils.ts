import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {EventDate} from "@/types/event";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


/** 年月日（例: 2025年5月18日） */
const formatYMD = (d: Date) =>
    new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(d);

/** 時分（例: 09:00） */
const formatHM = (d: Date) =>
    new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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

export function formatDate(date: string, isAllDay: boolean = false): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();

    if (isAllDay) {
        return `${year}年${month}月${day}日`;
    }

    return `${year}年${month}月${day}日 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
