import OrdersTable from "@/features/admin/categories/orders/components/orders-table"
import FilterControls2 from "@/features/admin/components/filter-controls/filter-controls2"
import AdminPageHeader from "@/features/admin/components/page-header"
import PaginationControl from "@/features/admin/components/pagination"
import usePaginatedFilters from "@/features/admin/hooks/use-paginated-filters"
import { useUpdateOrder } from "@/features/order/api/mutations"
import { useAdminOrders } from "@/features/order/api/queries"

const sortOptions = [
    { label: "Customer", value: "name" },
    { label: "Status", value: "status" },
    { label: "Total", value: "total" },
    { label: "Date", value: "createdAt" },
] as const

const filterOptions = [
    {
        label: "Status",
        value: "status",
        options: [
            { label: "Pending", value: "pending" },
            { label: "Processing", value: "processing" },
            { label: "Shipped", value: "shipped" },
            { label: "Completed", value: "completed" },
            { label: "Canceled", value: "canceled" },
        ],
    },
] as const

export default function AdminOrdersPage() {
    const { query, controls, page, setPage } = usePaginatedFilters({
        options: {
            filter: filterOptions,
            sort: sortOptions,
        },
        defaultSort: "createdAt:desc",
        pageSize: 5,
    })

    const { data, isPlaceholderData } = useAdminOrders(query)

    const orders = data?.data

    const { mutate } = useUpdateOrder()

    const totalText = data?.total ? `(${data.total} orders)` : ""

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Orders"
                description={`Manage customer orders and fulfillment ${totalText}`}
            />
            <FilterControls2 {...controls} />
            <OrdersTable
                orders={orders}
                onUpdate={mutate}
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
