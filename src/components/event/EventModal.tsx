'use client';

import { useEventModal } from '@/hooks/useEventModal';
import { EventDetail } from '@/types/event';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EventDetailView } from './EventDetailView';

export function EventModal() {
    const { isOpen, event, onClose } = useEventModal();

    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <EventDetailView event={event as EventDetail} />
            </DialogContent>
        </Dialog>
    );
} 