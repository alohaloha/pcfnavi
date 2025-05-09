import { EventCategoryKey, EventStatusKey } from '@/lib/constants';

// イベントステータスのキー
// export type EventStatusKey = 'wanted' | 'deadline' | 'scheduled' | 'held' | 'suspension' | 'unknown';

// イベントカテゴリのキー
// export type EventCategoryKey = 'tournament' | 'training' | 'meeting' | 'other';

export interface EventDate {
    start: string;
    end?: string;
    is_all_day: boolean;
    timezone?: string | null;
}

export interface EventItem {
    id: string;
    title: string;
    summary: string;
    eventDate: EventDate;
    location: string;
    capacity: number;
    price: number;
    organizer: string;
    source: string;
    status: EventStatusKey;
    category: EventCategoryKey[];
    cover: string;
    featured: boolean;
    pinned: boolean;
    isNew: boolean;
    notionBlockId?: string;
    applicationUrl?: string;
}

export interface EventDetail extends EventItem {
    detail: string;
    blocks: any[]; // NotionブロックデータはAny型で定義
    eventDateEnd?: string;
}

export interface EventFilters {
    status?: EventStatusKey;
    category?: EventCategoryKey | EventCategoryKey[]; // 単一または複数のカテゴリでフィルター可能に
    isFree?: boolean;
}

export interface EventListResponse {
    items: EventItem[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
} 