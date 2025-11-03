import { useRef, useState } from "react"

export function usePagination({
    totalPages = 1,
}: {
    totalPages?: number
} = {}) {
    const [page, setPage] = useState(1)

    const totalPagesRef = useRef(totalPages)

    function resetPage() {
        setPage(1)
    }

    function nextPage() {
        setPage((prev) => prev + 1)
    }

    function prevPage() {
        if (page > 1) {
            setPage((prev) => prev - 1)
        }
    }

    return {
        page,
        setPage,
        resetPage,
        nextPage,
        prevPage,
        totalPages: totalPagesRef.current,
    }
}
