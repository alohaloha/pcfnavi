import { EventCategoryKey, EventStatusKey } from '@/types/event';
import { EventStatus } from '@/lib/constants';
import { getEventCategoryName } from '@/lib/constant-util';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EventFilterProps {
    selectedStatus?: EventStatusKey;
    selectedCategories: EventCategoryKey[];
    isFree?: boolean;
    onStatusChange: (status?: EventStatusKey) => void;
    onCategoryChange: (categories: EventCategoryKey[]) => void;
    onIsFreeChange: (isFree?: boolean) => void;
}

export function EventFilter({
    selectedStatus,
    selectedCategories,
    isFree,
    onStatusChange,
    onCategoryChange,
    onIsFreeChange,
}: EventFilterProps) {
    // ステータスの選択を処理
    const handleStatusChange = (value: string) => {
        onStatusChange(value as EventStatusKey);
    };

    // カテゴリの選択を処理
    const handleCategoryChange = (category: EventCategoryKey) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        onCategoryChange(newCategories);
    };

    // 無料イベントの選択を処理
    const handleIsFreeChange = (checked: boolean) => {
        onIsFreeChange(checked ? true : undefined);
    };

    return (
        <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
            {/* ステータスフィルター */}
            <div>
                <h3 className="text-sm font-medium mb-3">ステータス</h3>
                <RadioGroup
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="status-all" />
                        <Label htmlFor="status-all">すべて</Label>
                    </div>
                    {Object.values(EventStatus).map((status) => (
                        <div key={status.key} className="flex items-center space-x-2">
                            <RadioGroupItem value={status.key} id={`status-${status.key}`} />
                            <Label htmlFor={`status-${status.key}`}>{status.name}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* カテゴリフィルター */}
            <div>
                <h3 className="text-sm font-medium mb-3">カテゴリ</h3>
                <div className="space-y-2">
                    {['tournament', 'training', 'meeting', 'other'].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category as EventCategoryKey)}
                                onCheckedChange={() => handleCategoryChange(category as EventCategoryKey)}
                            />
                            <Label htmlFor={`category-${category}`}>
                                {getEventCategoryName(category as EventCategoryKey)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* 料金フィルター */}
            <div>
                <h3 className="text-sm font-medium mb-3">料金</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is-free"
                        checked={isFree === true}
                        onCheckedChange={handleIsFreeChange}
                    />
                    <Label htmlFor="is-free">無料イベントのみ</Label>
                </div>
            </div>

            {/* フィルターリセットボタン */}
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    onStatusChange(undefined);
                    onCategoryChange([]);
                    onIsFreeChange(undefined);
                }}
            >
                フィルターをリセット
            </Button>
        </div>
    );
} 