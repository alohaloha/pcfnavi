import {EventCategoryKey, EventStatusKey} from '@/lib/constants';

export interface EventItem {
    id: string;
    title: string;
    summary: string;
    eventDate: string;
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
}

export interface EventDetail extends EventItem {
    detail: string;
    blocks: any[]; // NotionブロックデータはAny型で定義
    eventDateEnd?: string;
}

export interface EventFilters {
    status?: EventStatusKey;
    category?: EventCategoryKey;
    isFree?: boolean;
}

export interface EventListResponse {
    items: EventItem[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
} 