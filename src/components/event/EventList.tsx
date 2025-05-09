import { EventItem } from '@/types/event';
import { EventCard } from './EventCard';

interface EventListProps {
    events: EventItem[];
}

export function EventList({ events }: EventListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
} 