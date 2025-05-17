'use client';

import { useEffect, useState } from 'react';
import { formatSmartDate } from '@/lib/utils';

interface Props {
    date: Date | null;
}

export function RelativeTime({ date }: Props) {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        if (date) {
            setDisplay(formatSmartDate(new Date(date)));
        }
    }, [date]);

    return <span>{display}</span>;
}
