import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
    page: number
    setPage: (page: number) => void
    totalPages: number
}

export default function ProductsPagination({
    page,
    setPage,
    totalPages,
}: Props) {
    if (totalPages > 1)
        return (
            <Pagination className="mt-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className={
                                page === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    onClick={() => setPage(p)}
                                    isActive={page === p}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                setPage(Math.min(totalPages, page + 1))
                            }
                            className={
                                page === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
}
