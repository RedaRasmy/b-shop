import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
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
    // Calculate how many pages to show before and after current page
    const maxPrevious = 2
    const maxNext = 2

    // Calculate actual previous pages to show
    const startPage = Math.max(1, page - maxPrevious)
    const previousPages = Array.from(
        { length: page - startPage },
        (_, i) => startPage + i
    )

    // Calculate actual next pages to show
    const endPage = Math.min(totalPages, page + maxNext)
    const nextPages = Array.from(
        { length: endPage - page },
        (_, i) => page + i + 1
    )

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
                    {/* Show first page if not in range */}
                    {startPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(1)}
                                    isActive={false}
                                    className="cursor-pointer"
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {startPage > 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                        </>
                    )}

                    {/* Previous pages */}
                    {previousPages.map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                onClick={() => setPage(p)}
                                isActive={false}
                                className="cursor-pointer"
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Current page */}
                    <PaginationItem>
                        <PaginationLink
                            isActive={true}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>

                    {/* Next pages */}
                    {nextPages.map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                onClick={() => setPage(p)}
                                isActive={false}
                                className="cursor-pointer"
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Show last page if not in range */}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => setPage(totalPages)}
                                    isActive={false}
                                    className="cursor-pointer"
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
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
