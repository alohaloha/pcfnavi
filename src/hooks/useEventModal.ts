import { create } from 'zustand';
import { EventItem } from '@/types/event';

interface EventModalStore {
    isOpen: boolean;
    event: EventItem | null;
    onOpen: (event: EventItem) => void;
    onClose: () => void;
}

export const useEventModal = create<EventModalStore>((set) => ({
    isOpen: false,
    event: null,
    onOpen: (event) => set({ isOpen: true, event }),
    onClose: () => set({ isOpen: false, event: null }),
})); 