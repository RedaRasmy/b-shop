import type { Prettify } from "@/types/global-types"
import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

type ParamType = "string" | "number" | "boolean"

type Param<T extends ParamType> = {
    type: T
    default?: ToType<T>
}

type ToType<T extends ParamType> = T extends "string"
    ? string
    : T extends "number"
    ? number
    : boolean

type Params = Record<
    string,
    Param<"string"> | Param<"number"> | Param<"boolean">
>

type Query<P extends Params> = {
    [K in keyof P]: "default" extends keyof P[K]
        ? ToType<P[K]["type"]>
        : ToType<P[K]["type"]> | undefined
}

export function useQueryParams<P extends Params>(params: P) {
    const [searchParams, setSearchParams] = useSearchParams()

    const query = useMemo(() => {
        const entries = Object.entries(params).map(([key, value]) => {
            const urlValue = searchParams.get(key)
            if (urlValue) {
                // check types
                if (value.type === "number") {
                    const parsed = Number(urlValue)
                    return [key, isNaN(parsed) ? value.default : parsed]
                } else if (value.type === "boolean") {
                    const parsed =
                        urlValue === "false"
                            ? false
                            : urlValue === "true"
                            ? true
                            : value.default
                    return [key, parsed]
                } else {
                    return [key, urlValue || undefined]
                }
            } else {
                return [key, value.default]
            }
        })

        return Object.fromEntries(entries) as Prettify<Query<P>>
    }, [searchParams, params])

    const setQuery = useCallback(
        (updates: Prettify<Partial<Query<P>>>) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                for (const [key, val] of Object.entries(updates)) {
                    if (val === undefined || val === "") {
                        next.delete(key)
                    } else {
                        next.set(key, String(val))
                    }
                }
                return next
            })
        },
        [setSearchParams]
    )

    return [query, setQuery] as const
}

// test

// const testParams = {
//     search: {
//         type: "string",
//         default: "hello",
//     },
//     sort: {
//         type: "string",
//     },
//     price: {
//         type: "number",
//     },
// } as const satisfies Params

// function Compo2() {
//     const [query, setQuery] = useQueryParams2(testParams)

//     const updates = {
//         price : 54
//     }

//     setQuery(updates)
// }
