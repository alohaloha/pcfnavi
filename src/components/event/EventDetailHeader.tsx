import { EventDetail } from '@/types/event';
import { formatEventDate, formatSmartDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { getEventCategoryName } from '@/lib/constant-util';
import { RelativeTime } from "@/components/event/RelativeTime";

interface EventDetailHeaderProps {
    event: EventDetail;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <Card className="p-4 bg-white">
                <div className="flex items-start gap-4">
                    <Info className="w-10 h-10 text-muted-foreground mt-0.5" />
                    <div className="space-y-4 flex-1">
                        {event.category && event.category.length > 0 && (
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {event.category.map((cat, index) => (
                                            <span
                                                key={index}
                                                className="bg-cta text-xs px-2 py-1 rounded shadow-sm"
                                            >
                                                {getEventCategoryName(cat)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div>
                                <span className="font-medium">開催日時：</span>
                                <br />
                                {formatEventDate(event.eventDate)}
                            </div>
                            {event.location && (
                                <div>
                                    <span className="font-medium">会場：</span>
                                    <br />
                                    {event.location}
                                </div>
                            )}
                            {event.price > 0 && (
                                <div>
                                    <span className="font-medium">参加費：</span>
                                    <br />
                                    {event.price.toLocaleString()}円
                                </div>
                            )}
                            {event.capacity && (
                                <div>
                                    <span className="font-medium">定員：</span>
                                    <br />
                                    {event.capacity}名
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
                                        className="text-blue-600 hover:underline block max-w-full overflow-hidden text-ellipsis"
                                        title={event.source}
                                    >
                                        {event.source.length > 50 
                                            ? `${event.source.substring(0, 50)}...`
                                            : event.source}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {event.detail}
                        </div>

                        <p className="text-gray-500 text-sm text-right">最終更新日：<RelativeTime date={event.lastEditedTime} /></p>
                    </div>
                </div>
            </Card>
        </div>
    );
} 