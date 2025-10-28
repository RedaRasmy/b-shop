import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/features/categories/types"

type Props = {
    categories: Category[]
    onCategoryChange: (id: string | null) => void
    categoryId: string | null
    sortBy: string
    onSortChange: (sortBy: string) => void
}

export default function FilterBar({
    categories,
    categoryId,
    onCategoryChange,
    sortBy,
    onSortChange,
}: Props) {
    const sortOptions = [
        { value: "createdAt:desc", label: "Newest" },
        { value: "price:asc", label: "Price: Low to High" },
        { value: "price:desc", label: "Price: High to Low" },
        // { value: "rating", label: "Highest Rated" },
    ]

    return (
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={
                            categoryId === category.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                            onCategoryChange(
                                category.id === categoryId ? null : category.id
                            )
                        }
                        className="rounded-full"
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* <div className="flex border rounded-md">
                <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                >
                    <Grid className="h-4 w-4" />
                </Button>
                <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div> */}
            </div>
        </div>
    )
}
