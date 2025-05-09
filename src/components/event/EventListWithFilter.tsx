'use client';

import { useState } from 'react';
import { EventItem, EventCategoryKey, EventStatusKey } from '@/types/event';
import { EventList } from './EventList';
import { EventFilter } from './EventFilter';

interface EventListWithFilterProps {
    events: EventItem[];
}

export function EventListWithFilter({ events }: EventListWithFilterProps) {
    const [selectedStatus, setSelectedStatus] = useState<EventStatusKey>();
    const [selectedCategories, setSelectedCategories] = useState<EventCategoryKey[]>([]);
    const [isFree, setIsFree] = useState<boolean>();

    // フィルタリングされたイベントを取得
    const filteredEvents = events.filter(event => {
        // ステータスでフィルタリング
        if (selectedStatus && event.status !== selectedStatus) {
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
                    selectedStatus={selectedStatus}
                    selectedCategories={selectedCategories}
                    isFree={isFree}
                    onStatusChange={setSelectedStatus}
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