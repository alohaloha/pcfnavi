'use client';

import { useEffect, useState } from 'react';
import { formatSmartDate } from '@/lib/utils';

interface Props {
    date: Date | null;
}

export function RelativeTime({ date }: Props) {
    const [display, setDisplay] = useState<string>('');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        if (date) {
            setDisplay(formatSmartDate(new Date(date)));
        }
    }, [date]);

    // Show fallback date format before hydration to avoid mismatch
    if (!isHydrated || !date) {
        return date ? (
            <span suppressHydrationWarning>
                {new Date(date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </span>
        ) : <span>-</span>;
    }

    return <span suppressHydrationWarning>{display}</span>;
}
