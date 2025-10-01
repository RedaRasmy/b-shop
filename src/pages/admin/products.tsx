// import DataTableControls from "@/features/admin/components/data-table-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import AddProductDialog from "@/features/admin/products/components/add-product-dialog"

export default function AdminProductsPage() {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Poducts"
                description="Manage your product inventory"
            >
                <AddProductDialog />
            </AdminPageHeader>
            {/* <DataTableControls
                activeFilters={filters}
                onClearFilters={() => setFilters({})}
                sortBy={sortBy}
                filters={filterOptions}
                searchTerm={searchTerm}
                sortOptions={sortOptions}
                sortOrder={sortOrder}
                onFilterChange={handleFilterChange}
                onSearchChange={(search) => setSearchTerm(search)}
                onSortChange={handleSortChange}
            /> */}
        </div>
    )
}
