
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import CategoryCard from "@/features/admin/categories/components/category-card"

type Props = {
    categories: AdminCategory[]
    onDelete: (id: string) => void
    onEdit: (category: AdminCategory) => void
}

export default function CategoryList({ categories, onDelete, onEdit }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
                <CategoryCard
                    category={category}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}
