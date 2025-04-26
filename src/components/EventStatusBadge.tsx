import {Badge} from '@/components/ui/badge';
import {EventStatusKey} from '@/lib/constants';

interface EventStatusBadgeProps {
    status: EventStatusKey;
    large?: boolean;
}

export const EventStatusBadge = ({status, large = false}: EventStatusBadgeProps) => {
    // 文字列型をEventStatusKeyとして扱うための型アサーション
    const statusKey = status as EventStatusKey;
    
    const getStatusColor = (status: EventStatusKey) => {
        switch (status) {
            case 'wanted':
                return 'bg-green-500 hover:bg-green-600';
            case 'deadline':
                return 'bg-orange-500 hover:bg-orange-600';
            case 'held':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'scheduled':
                return 'bg-indigo-500 hover:bg-indigo-600';
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
            case 'scheduled':
                return '開催予定';
            case 'suspension':
                return '中止';
            case 'unknown':
            default:
                return '不明';
        }
    };

    // コンソールに現在のステータスを出力（デバッグ用）
    console.log('現在のステータス:', status);

    return (
        <Badge className={`${getStatusColor(statusKey)} ${large ? 'text-sm px-3 py-1' : ''}`}>
            {getStatusText(statusKey)}
        </Badge>
    );
}; 