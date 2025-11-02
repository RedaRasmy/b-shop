import AdminPageHeader from "@/features/admin/components/page-header"

export default function AdminCustomersPage() {
    // const totalText = data?.total ? `(${data.total} orders)` : ""

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Customers"
                description={`Manage your customer relationships ${0}`}
            />
            {/* <FilterControls {...controls} />
            <CustomersTable customers={customers} />
            <PaginationControl
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 0}
            /> */}
        </div>
    )
}
