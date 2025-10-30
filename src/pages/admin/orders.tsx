import AdminPageHeader from "@/features/admin/components/page-header"

export default function AdminOrdersPage() {
    return (
        <div>
            <AdminPageHeader
                title="Orders"
                description={`Manage customer orders and fulfillment (${0} orders)`}
            />
        </div>
    )
}
