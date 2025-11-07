import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { FilterOptions } from "@/features/admin/components/filter-controls"
import { Filter } from "lucide-react"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFilterChange: (key: string, value: string) => void
    options?: FilterOptions
    activeFilters: Record<string, string | null | undefined>
    onClear: () => void
    nullable?: boolean
}

export default function FilterDropdown({
    open,
    onOpenChange,
    options = [],
    activeFilters,
    onFilterChange,
    onClear,
}: Props) {
    const activeFilterCount =
        Object.values(activeFilters).filter(Boolean).length
    return (
        options.length > 0 && (
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-2 h-5 w-5 p-0 text-xs"
                            >
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filters</h4>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClear}
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>
                        {options.map((filter) => (
                            <div key={filter.value} className="space-y-2">
                                <label className="text-sm font-medium">
                                    {filter.label}
                                </label>
                                {filter.options.length > 0 && (
                                    <Select
                                        value={
                                            activeFilters[filter.value] || ""
                                        }
                                        onValueChange={(value) => {
                                            onFilterChange(filter.value, value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue
                                                placeholder={`Select ${filter.label.toLowerCase()}`}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filter.nullable && (
                                                <SelectItem
                                                    className="text-destructive font-semibold"
                                                    key={"__NULL__"}
                                                    value="__NULL__"
                                                >
                                                    No Category (Deleted)
                                                </SelectItem>
                                            )}
                                            {filter.options.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        )
    )
}
