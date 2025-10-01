import { getCategories } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import { AddCategoryDialog } from "@/features/admin/categories/components/add-category-dialog"
import CategoryList from "@/features/admin/categories/components/category-list"
import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useQuery } from "@tanstack/react-query"
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
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

    // const [status,setStatus] = useState<'active'|'inactive'|undefined>(undefined)

    type Status = "active" | "inactive"

    const filterOptions = [
        {
            label: "Status",
            value: "status",
            type: "select" as const,
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ]

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        // setCurrentPage(1)
    }

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Products", value: "products" },
        { label: "Created Date", value: "created" },
    ]

    const params = {
        search: searchTerm || undefined,
        sort: sortBy + ":" + sortOrder,
        status:
            filters["status"] === ""
                ? undefined
                : (filters["status"] as Status) ?? undefined,
    }

    const { data } = useQuery({
        queryKey: ["admin-categories", params],
        queryFn: () => getCategories(params),
        select: (res) => {
            console.log("res : ", res)
            return res.data as AdminCategory[]
        },
    })

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Categories"
                description={`Organize your products with categories (${
                    data?.length || 0
                } categories)`}
            >
                <AddCategoryDialog />
            </AdminPageHeader>
            <DataTableControls
                activeFilters={filters}
                onClearFilters={() => setFilters({})}
                sortBy={sortBy}
                filters={filterOptions}
                searchTerm={searchTerm}
                sortOptions={sortOptions}
                sortOrder={sortOrder}
                onFilterChange={handleFilterChange}
                onSearchChange={(search) => setSearchTerm(search)}
                onSortChange={() => {}}
            />
            <CategoryList categories={data || []} />
        </div>
    )
}
