import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import CategoryCard from "@/features/admin/categories/components/category-card"

type Props = {
    categories: AdminCategory[]
}

export default function CategoryList({ categories}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid:cols-4">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                />
            ))}
        </div>
    )
}
