import { EventDetail } from '@/types/event';
import { EventDetailContent } from './EventDetailContent';
import { EventDetailHeader } from './EventDetailHeader';
import { EventDetailSidebar } from './EventDetailSidebar';

interface EventDetailViewProps {
    event: EventDetail;
}

export function EventDetailView({ event }: EventDetailViewProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EventDetailHeader event={event} />
                    <EventDetailContent event={event} />
                </div>
                <div className="lg:col-span-1">
                    <EventDetailSidebar event={event} />
                </div>
            </div>
        </div>
    );
} 