'use client';

import React from 'react';
import { EventDetail } from '@/types/event';
import { parseSupabaseBlocks } from '@/lib/supabase-parser';

interface EventDetailContentProps {
    event: EventDetail;
}

export function EventDetailContent({ event }: EventDetailContentProps) {
    const parsedBlocks = React.useMemo(() => {
        return parseSupabaseBlocks(event.blocks);
    }, [event.blocks]);

    return (
        <div className="prose max-w-none">
            {parsedBlocks}
        </div>
    );
} 