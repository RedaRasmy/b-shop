import { AddCategoryDialog } from "@/features/admin/categories/components/add-category-dialog"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useState } from "react"

export default function AdminCategoriesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    // const [categories, setCategories] = useState(mockCategories)
    // const [addDialogOpen, setAddDialogOpen] = useState(false)
    // const [editDialogOpen, setEditDialogOpen] = useState(false)
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // const [selectedCategory, setSelectedCategory] = useState<any>(null)
    // const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const filterOptions = [
        {
            label: "Status",
            value: "status",
            type: "select" as const,
            options: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
            ],
        },
    ]
    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Products", value: "products" },
        { label: "Created Date", value: "created" },
    ]
    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Categories"
                description="Organize your products with categories (5 categories)"
            >
                <AddCategoryDialog />
            </AdminPageHeader>
            <DataTableControls
                activeFilters={filters}
                onClearFilters={() => {}}
                sortBy={sortBy}
                filters={filterOptions}
                searchTerm={searchTerm}
                sortOptions={sortOptions}
                sortOrder={sortOrder}
                onFilterChange={() => {}}
                onSearchChange={() => {}}
                onSortChange={() => {}}
            />
        </div>
    )
}
