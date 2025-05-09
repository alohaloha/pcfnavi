import { EventItem } from '@/types/event';
import { formatDate } from '@/lib/utils';
import { getEventCategoryName } from '@/lib/constant-util';

interface EventDetailSidebarProps {
    event: EventItem;
}

export function EventDetailSidebar({ event }: EventDetailSidebarProps) {
    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">イベント情報</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">開催日時：</span>
                            <br />
                            {formatDate(event.eventDate.start, event.eventDate.is_all_day)}
                            {event.eventDate.end && (
                                <>
                                    <br />
                                    〜 {formatDate(event.eventDate.end, event.eventDate.is_all_day)}
                                </>
                            )}
                        </div>
                        {event.location && (
                            <div>
                                <span className="font-medium">会場：</span>
                                <br />
                                {event.location}
                            </div>
                        )}
                        {event.capacity && (
                            <div>
                                <span className="font-medium">定員：</span>
                                <br />
                                {event.capacity}名
                            </div>
                        )}
                        {event.price && (
                            <div>
                                <span className="font-medium">参加費：</span>
                                <br />
                                {event.price}
                            </div>
                        )}
                        {event.organizer && (
                            <div>
                                <span className="font-medium">主催者：</span>
                                <br />
                                {event.organizer}
                            </div>
                        )}
                        {event.source && (
                            <div>
                                <span className="font-medium">情報元：</span>
                                <br />
                                <a
                                    href={event.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {event.source}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                {event.category && event.category.length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">カテゴリー</h3>
                        <div className="flex flex-wrap gap-2">
                            {event.category.map((cat, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                    {getEventCategoryName(cat)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 