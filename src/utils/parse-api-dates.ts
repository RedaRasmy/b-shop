/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseApiDates<T>(data: T, dateFields: (keyof T)[]): T {
    const result = { ...data }
    dateFields.forEach((field) => {
        if (result[field]) {
            result[field] = new Date(result[field] as any) as any
        }
    })
    return result
}
