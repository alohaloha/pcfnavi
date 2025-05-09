import { EventItem } from '@/types/event';
import { formatEventDate } from '@/lib/utils';
import Link from 'next/link';

interface EventCardProps {
    event: EventItem;
    onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/event/${event.id}`} className="block">
                {event.cover && (
                    <div className="relative h-48">
                        <img
                            src={event.cover}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.summary}</p>
                    <div className="text-sm text-gray-500">
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
                    </div>
                </div>
            </Link>
        </div>
    );
} 