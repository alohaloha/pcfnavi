'use client'

import React from 'react';
import Image from 'next/image';
import {parseEventBlocks} from '@/lib/event-parser';
import type {EventDetail} from '@/types/event';

interface EventDetailProps {
    event: EventDetail;
}

export default function EventDetail({event}: EventDetailProps) {
    const formattedDate = event.eventDate.start
        ? new Date(event.eventDate.start).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    const parsedBlocks = React.useMemo(() => {
        return parseEventBlocks(event.blocks ?? []);
    }, [event.blocks]);

    return (
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {event.cover && (
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={event.cover}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>
            )}

            <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                    {event.category?.map((cat) => (
                        <span
                            key={cat}
                            className="inline-block bg-cta text-xs px-2 py-1 rounded"
                        >
                            {cat}
                        </span>
                    )) ?? []}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>

                <div className="text-gray-500 mb-6">
                    {formattedDate}
                </div>

                <div className="text-gray-500 mb-6">
                    {event.detail}
                </div>
                <hr/>
                <div className="prose prose-blue max-w-none mt-2">
                    {parsedBlocks}
                </div>
            </div>
        </article>
    );
} 