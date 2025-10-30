export type Status = "active" | "inactive"
export type SortOrder = "asc" | "desc"

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type PaginatedResult<T> = {
    data: T
    page: number
    perPage: number
    total: number
    totalPages: number
    prevPage: number | null
    nextPage: number | null
}

export type BasicQuery = {
    search?: string
    sort?: string
}

export type PaginationQuery = {
    page?: number
    perPage?: number
}

export type Id = string | number
