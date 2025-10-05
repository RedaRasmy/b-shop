import { useRef, useState } from "react"

export function usePagination({ initialPage = 1, initialPerPage = 15 } = {}) {
    const [page, setPage] = useState(initialPage)
    const [perPage, setPerPage] = useState(initialPerPage)

    const totalPagesRef = useRef<number>(1)

    function setTotalPages(total: number) {
        totalPagesRef.current = total
    }

    function resetPage() {
        setPage(initialPage)
    }

    return {
        page,
        perPage,
        setPage,
        setPerPage,
        resetPage,
        totalPages: totalPagesRef.current,
        setTotalPages,
    }
}
