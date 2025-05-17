import { EventDetail } from '@/types/event';
import { EventDetailContent } from './EventDetailContent';
import { EventDetailHeader } from './EventDetailHeader';

interface EventDetailViewProps {
    event: EventDetail;
}

export function EventDetailView({ event }: EventDetailViewProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <EventDetailHeader event={event} />
                <EventDetailContent event={event} />
            </div>
        </div>
    );
} 