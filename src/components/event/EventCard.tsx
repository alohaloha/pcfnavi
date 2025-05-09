import { EventItem } from '@/types/event';
import { formatEventDate } from '@/lib/utils';
import Link from 'next/link';
import { EventStatusBadge } from '../EventStatusBadge';
import { getEventCategoryName } from '@/lib/constant-util';

interface EventCardProps {
    event: EventItem;
    onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <Link href={`/event/${event.id}`} className="block flex-1">
                {event.cover && (
                    <div className="relative h-48">
                        <img
                            src={event.cover}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        {event.isNew && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                                NEW
                            </div>
                        )}
                    </div>
                )}
                <div className="p-4 flex flex-col h-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {event.category.map((cat) => (
                            <span
                                key={cat}
                                className="px-2 py-1 bg-yellow-300 text-xs rounded shadow-sm"
                            >
                                {getEventCategoryName(cat)}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.summary}</p>
                    <div className="text-sm text-gray-500 flex-1">
                        <div className="mb-1">
                            <span className="font-medium">開催日時：</span>
                            {formatEventDate(event.eventDate)}
                        </div>
                        {event.location && (
                            <div className="mb-1">
                                <span className="font-medium">会場：</span>
                                {event.location}
                            </div>
                        )}
                        {event.price > 0 && (
                            <div className="mb-1">
                                <span className="font-medium">参加費：</span>
                                {event.price.toLocaleString()}円
                            </div>
                        )}
                        {event.capacity && (
                            <div className="mb-1">
                                <span className="font-medium">定員：</span>
                                {event.capacity}名
                            </div>
                        )}
                    </div>
                </div>
            </Link>
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                <EventStatusBadge status={event.status} />
                {event.featured && (
                    <span className="text-xs text-amber-600 font-medium">
                        ⭐ 注目イベント
                    </span>
                )}
            </div>
        </div>
    );
} 