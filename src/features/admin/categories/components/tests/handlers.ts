import { mockedCategories } from "@/features/admin/categories/components/tests/mocked-categories"
import { http, HttpResponse } from "msw"

type Id = {
    id: string
}

export const adminCategoriesHandlers = [
    /// ADD
    http.post("admin/categories", async () => {
        return HttpResponse.json(mockedCategories[0]) // return one
    }),

    /// GET
    http.get("admin/categories", async () => {
        return HttpResponse.json(mockedCategories)
    }),

    /// UPDATE
    http.put<Id>("admin/categories/:id", async () => {
        return HttpResponse.json(mockedCategories[0], { status: 201 })
    }),

    /// DELETE
    http.delete<Id>("admin/categories/:id", async () => {
        return HttpResponse.json(
            {},
            {
                status: 204,
            }
        )
    }),
]
