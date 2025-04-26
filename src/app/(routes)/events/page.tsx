'use client';

import React, {useState} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {fetchEventList, fetchEventDetail} from '@/lib/api-client/event';
import {EventCard} from '@/components/EventCard';
import {EventModal} from '@/components/EventModal';
import {EVENT_CATEGORIES, EVENT_STATUSES} from '@/lib/constants';
import {EventCategoryKey, EventStatusKey} from '@/lib/constants';
import {EventFilters} from '@/types/event';

export default function EventsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedEventId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(!!selectedEventId);
    const [events, setEvents] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

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
                const data = await fetchEventList(currentPage, 10, filters);
                console.log('イベント一覧の取得に成功しました:', data);
                setEvents(data.items);
                setTotalPages(data.pageCount);
            } catch (error) {
                console.error('イベント一覧の取得に失敗しました:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, [currentPage, filters]);

    // URLからイベントIDが指定されている場合、そのイベントの詳細を取得
    React.useEffect(() => {
        if (selectedEventId) {
            const loadEventDetail = async () => {
                try {
                    const event = await fetchEventDetail(selectedEventId);
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

    // イベントカードがクリックされたときの処理
    const handleEventClick = async (eventId: string) => {
        try {
            const event = await fetchEventDetail(eventId);
            if (event) {
                setSelectedEvent(event);
                setIsDialogOpen(true);
                // URLにイベントIDを追加
                router.push(`/events?id=${eventId}`, {scroll: false});
            }
        } catch (error) {
            console.error('イベント詳細の取得に失敗しました:', error);
        }
    };

    // ダイアログが閉じられたときの処理
    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            // URLからイベントIDを削除
            router.push('/events', {scroll: false});
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

        // フィルター変更時はページを1に戻す
        setCurrentPage(1);
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

        // フィルター変更時はページを1に戻す
        setCurrentPage(1);
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
                            {EVENT_STATUSES.map((status) => (
                                <button
                                    key={status.key}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        filters.status === status.key
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
                            {EVENT_CATEGORIES.map((category) => {
                                // 選択済みのカテゴリかどうかをチェック（配列またはシングル値）
                                const isSelected = Array.isArray(filters.category) 
                                    ? filters.category.includes(category.key)
                                    : filters.category === category.key;
                                
                                return (
                                    <button
                                        key={category.key}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                                onClick={() => handlePriceFilterChange(true)}
                            >
                                無料
                            </button>
                            <button
                                className={`px-3 py-1 rounded-full text-sm ${
                                    filters.isFree === false
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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

                    {/* ページネーション */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    前へ
                                </button>

                                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === page
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border hover:bg-muted'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border disabled:opacity-50"
                                >
                                    次へ
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}

            {/* イベント詳細モーダル */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    open={isDialogOpen}
                    onOpenChange={handleDialogClose}
                />
            )}
        </div>
    );
}
