import FilterControls2 from "@/features/admin/components/filter-controls/filter-controls2"
import AdminPageHeader from "@/features/admin/components/page-header"
import PaginationControl from "@/features/admin/components/pagination"
import { usePagination } from "@/features/admin/hooks/use-pagination"
import { useCustomers } from "@/features/profile/api/queries"
import CustomersTable from "@/features/profile/components/customers-table"
import type { CustomersQuery } from "@/features/profile/query-keys"
import { useDebounce } from "@/hooks/use-debounce"
import { useQueryParams } from "@/hooks/use-query-params"
import type { SortOrder } from "@/types/global-types"

const sortOptions = [
    { label: "Orders", value: "orders" },
    { label: "Total Spent", value: "total" },
    { label: "Join Date", value: "createdAt" },
]

export default function AdminCustomersPage() {
    const [query, setQuery] = useQueryParams<
        Omit<CustomersQuery, "page" | "perPage">
    >({
        search: undefined,
        sort: "createdAt:desc",
    })

    const [field, order] = query.sort
        ? (query.sort.split(":") as [string, SortOrder])
        : (["createdAt", "desc"] as [string, SortOrder])

    const debouncedQuery = useDebounce({
        state: query,
    })
    const { page, setPage } = usePagination()

    const { data } = useCustomers({ ...debouncedQuery, page, perPage: 6 })

    const totalText = data?.total ? `(${data.total} customers)` : ""

    return (
        <div className="space-y-6 h-full flex flex-col">
            <AdminPageHeader
                title="Customers"
                description={`Manage your customer relationships ${totalText}`}
            />
            <FilterControls2
                options={{ sort: sortOptions }}
                query={{
                    search: query.search,
                    sort: {
                        field,
                        order,
                    },
                }}
                setQuery={({ search, sort }) =>
                    setQuery({
                        search,
                        sort: sort ? sort.field + ":" + sort.order : undefined,
                    })
                }
            />
            <CustomersTable customers={data?.data ?? []} />

            {data && (
                <PaginationControl
                    page={page}
                    setPage={setPage}
                    totalPages={data?.totalPages ?? 0}
                />
            )}
        </div>
    )
}
