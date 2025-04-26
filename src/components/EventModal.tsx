import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Badge} from '@/components/ui/badge';
import {EventDetail} from '@/types/event';
import {EventStatusBadge} from './EventStatusBadge';
import {CustomDialog} from './layout/CustomDialog';
import {formatDate} from '@/lib/utils';
import {parseNotionBlocks} from '@/lib/notionParser';

interface EventModalProps {
    event: EventDetail;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EventModal = ({event, open, onOpenChange}: EventModalProps) => {
    // 料金のフォーマット
    const formattedPrice = event.price === 0
        ? '無料'
        : `¥${event.price.toLocaleString()}`;

    // 日付のフォーマット
    const formattedDate = formatDate(event.eventDate);

    // bulletedとnumberedのリストアイテムをグループ化
    const renderGroupedBlocks = () => {
        const groupedBlocks: React.ReactNode[] = [];
        let currentList: React.ReactNode[] = [];
        let currentListType: string | null = null;

        // parseNotionBlocksを使用してNotionブロックをReactノードに変換
        const parsedBlocks = parseNotionBlocks(event.blocks);
        
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

    // ダイアログのタイトル
    const dialogTitle = (
        <span className="text-2xl">{event.title}</span>
    );

    // ダイアログの説明
    const dialogDescription = (
        <div className="flex flex-wrap gap-1 mt-2">
            {event.category.map((cat) => (
                <Badge key={cat} variant="outline">
                    {cat}
                </Badge>
            ))}
            <EventStatusBadge status={event.status}/>
            {event.isNew && (
                <Badge className="bg-amber-500 hover:bg-amber-600">NEW</Badge>
            )}
        </div>
    );

    // ダイアログの内容
    const dialogContent = (
        <>
            {event.cover && (
                <div className="relative h-60 mb-4">
                    <Image
                        src={event.cover}
                        alt={event.title}
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                    <p className="text-lg mb-4">{event.summary}</p>
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">日時:</span> {formattedDate}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">場所:</span> {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">主催:</span> {event.organizer}
                        </div>
                        {event.capacity > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">定員:</span> {event.capacity}名
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">料金:</span> {formattedPrice}
                        </div>
                    </div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">イベント情報</h3>
                    <div className="space-y-2">
                        {event.source && (
                            <div className="break-words">
                                <span className="font-semibold block">掲載元:</span>
                                <Link
                                    href={event.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {event.source}
                                </Link>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span className="font-semibold block w-full">カテゴリ:</span>
                            {event.category.map((cat) => (
                                <Badge key={cat} variant="outline">
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">詳細情報</h2>
                <div className="prose max-w-none">
                    {renderGroupedBlocks()}
                </div>
            </div>
        </>
    );

    // ダイアログのフッター
    const dialogFooter = (
        <div className="flex justify-between w-full">
            <div className="flex gap-2">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                    }}
                >
                    <span>共有</span>
                </button>
            </div>
        </div>
    );

    return (
        <CustomDialog
            open={open}
            onOpenChange={onOpenChange}
            title={dialogTitle}
            description={dialogDescription}
            footer={dialogFooter}
            maxWidth="3xl"
            fullHeight={true}
        >
            {dialogContent}
        </CustomDialog>
    );
}; 