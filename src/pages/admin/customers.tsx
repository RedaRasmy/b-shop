import FilterControls2 from "@/features/admin/components/filter-controls/filter-controls2"
import AdminPageHeader from "@/features/admin/components/page-header"
import PaginationControl from "@/features/admin/components/pagination"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import { useCustomers } from "@/features/profile/api/queries"
import CustomersTable from "@/features/profile/components/customers-table"

const sortOptions = [
    { label: "Orders", value: "orders" },
    { label: "Total Spent", value: "total" },
    { label: "Join Date", value: "createdAt" },
] as const

export default function AdminCustomersPage() {
    const { query, controls, page, setPage } = usePaginatedFilters({
        sortOptions,
        pageSize: 6,
        defaultSort: "createdAt:desc",
    })

    const { data, isPlaceholderData } = useCustomers(query)

    const totalText = data?.total ? `(${data.total} customers)` : ""

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Customers"
                description={`Manage your customer relationships ${totalText}`}
            />
            <FilterControls2 {...controls} />
            <CustomersTable
                customers={data?.data ?? []}
                isUpdating={isPlaceholderData}
            />

            <PaginationControl
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 1}
            />
        </div>
    )
}
