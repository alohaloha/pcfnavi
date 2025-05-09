'use client';

import React, {useState, Suspense} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {getEventListFromSupabase, getEventDetailFromSupabase} from '@/lib/server/event';
import {EventCard} from '@/components/EventCard';
import {EventModal} from '@/components/EventModal';
import {EventCategoryType, EventStatusType, EventStatusArray, EventCategoryArray} from '@/lib/constants';
import {EventFilters} from '@/types/event';

// useSearchParamsを使用するコンポーネントを分離
function EventDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedEventId = searchParams.get('id');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(!!selectedEventId);

    // URLからイベントIDが指定されている場合、そのイベントの詳細を取得
    React.useEffect(() => {
        if (selectedEventId) {
            const loadEventDetail = async () => {
                try {
                    const event = await getEventDetailFromSupabase(selectedEventId);
                    console.log({ event });
                    if (event) {
                        setSelectedEvent(event);
                        setIsDialogOpen(true);
                    }
                } catch (error) {
                    console.error('イベント詳細の取得に失敗しました:', error);
                }
            };

            loadEventDetail();
        }
    }, [selectedEventId]);

    // ダイアログが閉じられたときの処理
    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            // URLからイベントIDを削除
            router.push('/events', {scroll: false});
        }
    };

    if (!selectedEvent) return null;

    return (
        <EventModal
            event={selectedEvent}
            open={isDialogOpen}
            onOpenChange={handleDialogClose}
        />
    );
}

export default function EventsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<any[]>([]);

    // フィルター状態
    const [filters, setFilters] = useState<EventFilters>({
        status: 'scheduled',
        category: undefined,
        isFree: undefined,
    });

    // イベント一覧の取得
    React.useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            try {
                const data = await getEventListFromSupabase();
                setEvents(data);
            } catch (error) {
                console.error('イベント一覧の取得に失敗しました:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, [filters]);

    // イベントカードがクリックされたときの処理
    const handleEventClick = async (eventId: string) => {
        try {
            // URLにイベントIDを追加
            router.push(`/events?id=${eventId}`, {scroll: false});
        } catch (error) {
            console.error('イベント詳細の取得に失敗しました:', error);
        }
    };

    // フィルター変更時の処理
    const handleFilterChange = (key: keyof EventFilters, value: any) => {
        setFilters(prev => {
            // statusフィルターの場合 - 同じ値を選択したらリセット
            if (key === 'status') {
                if (prev[key] === value) {
                    const newFilters = {...prev};
                    newFilters[key] = undefined;
                    return newFilters;
                }
                return {...prev, [key]: value};
            }

            // categoryフィルターの場合 - 複数選択に対応
            if (key === 'category') {
                // 現在の選択状態を確認
                const currentCategories = Array.isArray(prev.category)
                    ? [...prev.category]
                    : prev.category ? [prev.category] : [];

                // 既に選択されている場合は除去
                if (currentCategories.includes(value)) {
                    const newCategories = currentCategories.filter(cat => cat !== value);
                    return {
                        ...prev,
                        category: newCategories.length > 0 ? newCategories : undefined
                    };
                }

                // 選択されていない場合は追加
                return {
                    ...prev,
                    category: [...currentCategories, value]
                };
            }

            // その他のフィルター（isFreeなど）
            if (prev[key] === value) {
                const newFilters = {...prev};
                newFilters[key] = undefined;
                return newFilters;
            }

            return {...prev, [key]: value};
        });
    };

    // 料金フィルター変更時の処理
    const handlePriceFilterChange = (isFree: boolean) => {
        setFilters(prev => {
            // 同じ値がすでに選択されている場合はリセット
            if (prev.isFree === isFree) {
                const newFilters = {...prev};
                newFilters.isFree = undefined;
                return newFilters;
            }

            return {...prev, isFree};
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">イベント情報</h1>

            {/* フィルターセクション */}
            <div className="bg-muted p-4 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">フィルター</h2>
                <div className="flex flex-wrap gap-4">
                    {/* ステータスフィルター */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">状態</h3>
                        <div className="flex flex-wrap gap-2">
                            {EventStatusArray.map((status) => (
                                <button
                                    key={status.key}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        filters.status === status.key
                                            ? 'bg-accent text-white'
                                            : 'bg-gray-200 text-primary-700 hover:bg-accent/80 hover:text-white'
                                    }`}
                                    onClick={() => handleFilterChange('status', status.key)}
                                >
                                    {status.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* カテゴリフィルター */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">カテゴリ</h3>
                        <div className="flex flex-wrap gap-2">
                            {EventCategoryArray.map((category) => {
                                // 選択済みのカテゴリかどうかをチェック（配列またはシングル値）
                                const isSelected = Array.isArray(filters.category)
                                    ? filters.category.includes(category.key)
                                    : filters.category === category.key;

                                return (
                                    <button
                                        key={category.key}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            isSelected
                                                ? 'bg-accent text-white'
                                                : 'bg-gray-200 text-primary-700 hover:bg-accent/80 hover:text-white'
                                        }`}
                                        onClick={() => handleFilterChange('category', category.key)}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 料金フィルター */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">料金</h3>
                        <div className="flex gap-2">
                            <button
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filters.isFree === true
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-200 text-primary-700 hover:bg-accent/80 hover:text-white'
                                }`}
                                onClick={() => handlePriceFilterChange(true)}
                            >
                                無料
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filters.isFree === false
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-200 text-primary-700 hover:bg-accent/80 hover:text-white'
                                }`}
                                onClick={() => handlePriceFilterChange(false)}
                            >
                                有料
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl">読み込み中...</div>
                </div>
            ) : (
                <>
                    {/* イベント一覧 */}
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onClick={() => handleEventClick(event.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted rounded-lg">
                            <p className="text-xl">該当するイベントはありません。</p>
                            <p className="text-muted-foreground mt-2">フィルター条件を変更してみてください。</p>
                        </div>
                    )}
                </>
            )}

            {/* イベント詳細モーダル - Suspenseでラップ */}
            <Suspense fallback={<div>詳細を読み込み中...</div>}>
                <EventDetail/>
            </Suspense>
        </div>
    );
}
