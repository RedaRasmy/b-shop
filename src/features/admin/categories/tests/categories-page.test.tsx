import CategoriesPage from "@/pages/categories"
import { setup } from "@/tests/test-utils"
import { it, describe } from "vitest"

describe("Admin Categories Page", () => {
    it("open add-category form and submit a new one" , async () => { 
        const {user,render} = setup(<CategoriesPage/>)

        const addCategory = render.getByText('Add Category')

        await user.click(addCategory)
     })
})
