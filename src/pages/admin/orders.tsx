import FilterControls from "@/features/admin/components/filter-controls"
import AdminPageHeader from "@/features/admin/components/page-header"
import { useFilterControls } from "@/features/admin/hooks/use-filter-controls"

const sortOptions = [
    { label: "Customer", value: "name" },
    { label: "Status", value: "status" },
    { label: "Total", value: "total" },
    { label: "Date", value: "createdAt" },
]
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
]

export default function AdminOrdersPage() {
    // Filter controls
    const { controls } = useFilterControls({
        filterOptions,
        sortOptions,
        pagination: true,
    })

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Orders"
                description={`Manage customer orders and fulfillment (${0} orders)`}
            />
            <FilterControls {...controls} />
        </div>
    )
}
