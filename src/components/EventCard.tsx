import {EventItem} from '@/types/event';
import {EventStatusBadge} from './EventStatusBadge';
import {CustomCard} from './layout/CustomCard';
import {formatEventDate, formatPrice} from '@/lib/utils';
import {getEventCategoryName} from "@/lib/constant-util";

interface EventCardProps {
    event: EventItem;
    onClick?: () => void;
}

export const EventCard = ({event, onClick}: EventCardProps) => {
    const formattedPrice = formatPrice(event.price);

    const formattedDate = formatEventDate(event.eventDate);

    // イベントバッジの作成
    const eventBadges = event.category.map(cat => ({
        text: getEventCategoryName(cat),
        variant: 'outline' as const,
        className: 'text-xs'
    }));

    // 情報表示用のコンテンツ
    const cardContent = (
        <div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {event.summary}
            </p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <span>📅</span> {formattedDate}
                </div>
                <div className="flex items-center gap-1">
                    <span>📍</span> {event.location}
                </div>
                <div className="flex items-center gap-1">
                    <span>💰</span> {formattedPrice}
                </div>
            </div>
        </div>
    );

    // フッターコンテンツ
    const cardFooter = (
        <div className="flex justify-between items-center w-full">
            <EventStatusBadge status={event.status}/>
            <div className="text-xs text-muted-foreground">
                {event.capacity ? `定員: ${event.capacity}名` : ''}
            </div>
        </div>
    );

    return (
        <CustomCard
            title={event.title}
            badges={eventBadges}
            image={event.cover ? {
                src: event.cover,
                alt: event.title
            } : undefined}
            featured={event.featured}
            cornerBadge={event.isNew ? {
                text: 'NEW',
                className: 'bg-amber-500 hover:bg-amber-600'
            } : undefined}
            onClick={onClick}
        >
            {cardContent}
            {cardFooter}
        </CustomCard>
    );
}; 