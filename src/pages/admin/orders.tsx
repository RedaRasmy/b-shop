import OrdersTable from "@/features/admin/categories/orders/components/orders-table"
import FilterControls from "@/features/admin/components/filter-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import PaginationControl from "@/features/admin/components/pagination"
import { useFilterControls } from "@/features/admin/hooks/use-filter-controls"
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
    // Filter controls
    const { controls, queryParams, page, setPage } = useFilterControls({
        filterOptions,
        sortOptions,
        pagination: true,
        perPage: 5,
    })

    const { data } = useAdminOrders(queryParams)

    const orders = data?.data

    const { mutate } = useUpdateOrder()

    const totalText = data?.total ? `(${data.total} orders)` : ""

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Orders"
                description={`Manage customer orders and fulfillment ${totalText}`}
            />
            <FilterControls {...controls} />
            <OrdersTable orders={orders} onUpdate={mutate} />
            <PaginationControl
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 0}
            />
        </div>
    )
}
