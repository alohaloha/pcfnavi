import { Badge } from '@/components/ui/badge';
import { getEventCategoryName } from '@/lib/constant-util';
import { EventCategoryKey } from '@/lib/constants';

interface EventCategoryBadgeProps {
    category: EventCategoryKey;
}

export const EventCategoryBadge = ({ category }: EventCategoryBadgeProps) => {
    return (
        <Badge className="bg-yellow-300 text-xs px-2 py-1 rounded shadow-sm">
            {getEventCategoryName(category)}
        </Badge>
    );
};
