import { EventDetail } from '@/types/event';
import { formatEventDate } from '@/lib/utils';

interface EventDetailHeaderProps {
    event: EventDetail;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 flex-col">
                <div>
                    <span className="font-medium">開催日時：</span>
                    {formatEventDate(event.eventDate)}
                </div>
                {event.location && (
                    <div>
                        <span className="font-medium">会場：</span>
                        {event.location}
                    </div>
                )}
                {event.organizer && (
                    <div>
                        <span className="font-medium">主催者：</span>
                        {event.organizer}
                    </div>
                )}
            </div>
        </div>
    );
} 