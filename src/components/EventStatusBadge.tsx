import {Badge} from '@/components/ui/badge';
import {EventStatusKey} from '@/lib/constants';

interface EventStatusBadgeProps {
    status: EventStatusKey;
}

export const EventStatusBadge = ({status}: EventStatusBadgeProps) => {
    const getStatusColor = (status: EventStatusKey) => {
        switch (status) {
            case 'wanted':
                return 'bg-green-500 hover:bg-green-600';
            case 'deadline':
                return 'bg-orange-500 hover:bg-orange-600';
            case 'held':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'suspension':
                return 'bg-red-500 hover:bg-red-600';
            case 'unknown':
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const getStatusText = (status: EventStatusKey) => {
        switch (status) {
            case 'wanted':
                return '募集中';
            case 'deadline':
                return '募集締切';
            case 'held':
                return '開催済み';
            case 'suspension':
                return '中止';
            case 'unknown':
            default:
                return '不明';
        }
    };

    return (
        <Badge className={getStatusColor(status)}>
            {getStatusText(status)}
        </Badge>
    );
}; 