'use client';

import { useState } from 'react';
import { EventItem } from '@/types/event';
import { EventCategoryKey, EventStatusKey } from '@/lib/constants';
import { EventList } from './EventList';
import { EventFilter } from './EventFilter';

interface EventListWithFilterProps {
    events: EventItem[];
}

export function EventListWithFilter({ events }: EventListWithFilterProps) {
    const [selectedStatuses, setSelectedStatuses] = useState<EventStatusKey[]>(['scheduled', 'nowOn']);
    const [selectedCategories, setSelectedCategories] = useState<EventCategoryKey[]>([]);
    const [isFree, setIsFree] = useState<boolean>();

    // フィルタリングされたイベントを取得
    const filteredEvents = events.filter(event => {
        // ステータスでフィルタリング
        if (selectedStatuses.length > 0 && !selectedStatuses.includes(event.status)) {
            return false;
        }

        // カテゴリでフィルタリング
        if (selectedCategories.length > 0 && !selectedCategories.every(cat => event.category.includes(cat))) {
            return false;
        }

        // 無料イベントでフィルタリング
        if (isFree && event.price > 0) {
            return false;
        }

        return true;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <EventFilter
                    selectedStatuses={selectedStatuses}
                    selectedCategories={selectedCategories}
                    isFree={isFree}
                    onStatusChange={setSelectedStatuses}
                    onCategoryChange={setSelectedCategories}
                    onIsFreeChange={setIsFree}
                />
            </div>
            <div className="lg:col-span-3">
                <EventList events={filteredEvents} />
            </div>
        </div>
    );
} 