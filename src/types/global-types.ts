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

export type RequiredButUndefined<T> = {
    [K in keyof Required<T>]: T[K] | undefined
}

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
}

export type DeepMutable<T> = T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T

export type RenameKey<
    T extends Record<string, unknown>,
    Old extends keyof T,
    New extends string
> = Prettify<{
    [K in keyof T as K extends Old ? New : K]: T[K]
}>
