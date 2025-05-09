import { EventCategoryKey, EventStatusKey, EventStatus, EventCategory } from '@/lib/constants';
import { getEventCategoryName } from '@/lib/constant-util';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';

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

    const FilterContent = () => (
        <div className="space-y-6">
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
                    {Object.values(EventCategory).map((category) => (
                        <div key={category.key} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category.key}`}
                                checked={selectedCategories.includes(category.key)}
                                onCheckedChange={() => handleCategoryChange(category.key)}
                            />
                            <Label htmlFor={`category-${category.key}`}>
                                {category.name}
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

    return (
        <>
            {/* デスクトップ表示 */}
            <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm">
                <FilterContent />
            </div>

            {/* モバイル表示 */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="mr-2 h-4 w-4" />
                            フィルター
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] bg-white">
                        <SheetHeader>
                            <SheetTitle>フィルター</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
} 