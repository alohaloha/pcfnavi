import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {EventDetail} from '@/types/event';
import {EventStatusBadge} from './EventStatusBadge';
import {CustomDialog} from './layout/CustomDialog';
import {formatEventDate, formatPrice} from '@/lib/utils';
import {parseNotionBlocks} from '@/lib/notionParser';
import {EventCategoryBadge} from './EventCategoryBadge';
import {parseSupabaseBlocks} from "@/lib/supabase-parser";

interface EventModalProps {
    event: EventDetail;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EventModal = ({event, open, onOpenChange}: EventModalProps) => {
    // 料金のフォーマット
    const formattedPrice = formatPrice(event.price);

    const formattedDate = formatEventDate(event.eventDate);

    // bulletedとnumberedのリストアイテムをグループ化
    const renderGroupedBlocks = () => {
        const groupedBlocks: React.ReactNode[] = [];
        let currentList: React.ReactNode[] = [];
        let currentListType: string | null = null;

        // parseNotionBlocksを使用してNotionブロックをReactノードに変換
        const parsedBlocks = parseSupabaseBlocks(event.blocks);

        event.blocks.forEach((block: any, index: number) => {
            if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
                const listType = block.type === 'bulleted_list_item' ? 'ul' : 'ol';

                if (currentListType && currentListType !== listType) {
                    // リストタイプが変わったらグループを追加
                    groupedBlocks.push(
                        React.createElement(currentListType, {key: `list-${index}`}, currentList)
                    );
                    currentList = [];
                }

                currentListType = listType;
                // 対応するインデックスのパース済みブロックを使用
                if (parsedBlocks[index]) {
                    currentList.push(parsedBlocks[index]);
                }
            } else {
                // リストではない場合、現在のリストがあればグループに追加
                if (currentList.length > 0) {
                    groupedBlocks.push(
                        React.createElement(currentListType!, {key: `list-${index}`}, currentList)
                    );
                    currentList = [];
                    currentListType = null;
                }

                // 対応するインデックスのパース済みブロックを使用
                if (parsedBlocks[index]) {
                    groupedBlocks.push(parsedBlocks[index]);
                }
            }
        });

        // 最後のリストがあれば追加
        if (currentList.length > 0 && currentListType) {
            groupedBlocks.push(
                React.createElement(currentListType, {key: 'list-last'}, currentList)
            );
        }

        return groupedBlocks;
    };

    // ソースURLがあればドメインを取得
    const getSourceDomain = () => {
        if (!event.source) return '';
        try {
            const url = new URL(event.source);
            return url.hostname.replace('www.', '');
        } catch (e) {
            return event.source;
        }
    };

    // ダイアログのタイトル
    const dialogTitle = (
        <div className="text-2xl font-bold leading-tight">{event.title}</div>
    );

    // ダイアログの説明
    const dialogDescription = (
        <span className="flex flex-wrap gap-1.5 mt-2">
            {event.category.map((cat) => (
                <EventCategoryBadge key={cat} category={cat}/>
            ))}
            <EventStatusBadge status={event.status}/>
            {event.isNew && (
                <Badge className="bg-red-400 hover:bg-red-500 text-white">NEW</Badge>
            )}
        </span>
    );

    // ダイアログの内容
    const dialogContent = (
        <div className="space-y-6">
            {event.cover && (
                <div className="relative h-72 w-full rounded-lg overflow-hidden">
                    <Image
                        src={event.cover}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="">
                <div className="md:col-span-2 space-y-4">
                    <p className="text-lg leading-relaxed text-foreground">{event.summary}</p>
                    <div className="space-y-3 bg-muted/50 p-4 rounded-lg border bg-white">
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">掲載元:</span>
                            {event.source && event.source.startsWith('http') && (
                                <Link
                                    href={event.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent underline hover:underline text-sm"
                                >
                                    {getSourceDomain() || event.source}
                                </Link>
                            )}
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">日時:</span>
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">場所:</span>
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">主催:</span>
                            <span>{event.organizer}</span>
                        </div>
                        {event.capacity > 0 && (
                            <div className="flex items-start gap-2">
                                <span className="font-semibold min-w-24">定員:</span>
                                <span>{event.capacity}名</span>
                            </div>
                        )}
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">料金:</span>
                            <span>{formattedPrice}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-24">内容:</span>
                            <span>{event.detail}</span>
                        </div>
                    </div>
                </div>
            </div>

            {event.blocks && event.blocks.length > 0 && (
                <div className="border-t p-6 mt-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">詳細情報</h2>
                    <div className="prose prose-sm md:prose-base max-w-none">
                        {renderGroupedBlocks()}
                    </div>
                </div>
            )}

            <div className="mt-8 border-t pt-4 flex justify-between">
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 text-sm font-medium transition-colors"
                        onClick={() => {
                            const url = window.location.href;
                            navigator.clipboard.writeText(url);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="mr-1">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                        リンクをコピー
                    </button>
                </div>
                {event.source && event.source.startsWith('http') && (
                    <Link
                        href={event.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        掲載元サイトを開く
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <CustomDialog
            open={open}
            onOpenChange={onOpenChange}
            title={dialogTitle}
            description={dialogDescription}
            contentClassName="p-5"
            maxWidth="full"
            fullHeight={true}
            className="bg-cream"
        >
            {dialogContent}
        </CustomDialog>
    );
}; 