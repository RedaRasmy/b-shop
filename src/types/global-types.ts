export type Status = "active" | "inactive"
export type Order = "asc" | "desc"

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type PaginationResponse<T> = {
    data: T
    page: number
    perPage: number
    total: number | null
    totalPages: number | null
}
