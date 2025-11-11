import Filters from "@/features/admin/components/filter-controls"
import { getOptions } from "@/features/admin/components/filter-controls/get-options"
import AdminPageHeader from "@/features/admin/components/page-header"
import PaginationControl from "@/features/admin/components/pagination"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import { useCustomers } from "@/features/profile/api/queries"
import CustomersTable from "@/features/admin/components/customers/customers-table"

const { sortOptions } = getOptions({
    sort: [
        { label: "Orders", value: "orders", type: "number" },
        { label: "Total Spent", value: "total", type: "number" },
        { label: "Join Date", value: "createdAt", type: "date" },
    ],
})

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
            <Filters
                {...controls}
                searchPlaceholder="Search by customer name , email , phone number"
            />
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
