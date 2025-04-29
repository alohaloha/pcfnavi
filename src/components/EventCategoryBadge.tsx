import { Badge } from '@/components/ui/badge';
import { getEventCategoryName } from '@/lib/constant-util';
import { EventCategoryKey } from '@/lib/constants';

interface EventCategoryBadgeProps {
    category: EventCategoryKey;
}

export const EventCategoryBadge = ({ category }: EventCategoryBadgeProps) => {
    return (
        <Badge variant="outline" className="text-sm">
            {getEventCategoryName(category)}
        </Badge>
    );
};
