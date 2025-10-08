// import { insertCategory } from "@/features/admin/categories/tests/handlers"
// import AdminCategoriesPage from "@/pages/admin/categories"
// import {  setup, waitFor , screen} from "@/tests/test-utils"
// import { it, describe, expect } from "vitest"

// describe("Admin Categories Page", async () => {
// it("should create a new category", async () => {
//         const { user } = setup(<AdminCategoriesPage />)

//         // ✅ 1. Wait for initial categories to load
//         expect(screen.getByText("Add Category")).toBeInTheDocument()
//         await waitFor(() => {
//             // Get initial count (after data loads!)
//             const initialButtons = screen.getAllByRole("button", { name: /edit/i })
//             const initialCount = initialButtons.length
//             expect(initialCount).toEqual(5)
//         })


//         // ✅ 2. Open dialog (no act needed!)
//         await user.click(screen.getByText("Add Category"))

//         // ✅ 3. Wait for dialog to open
//         await waitFor(() => {
//             expect(
//                 screen.getByPlaceholderText("Enter category name")
//             ).toBeInTheDocument()
//         })

//         // ✅ 4. Fill form
//         const { name, description, slug } = insertCategory
        
//         await user.type(screen.getByLabelText("Category Name"), name)
//         await user.type(screen.getByLabelText("Description"), description)

//         // Check slug auto-generated
//         expect(screen.getByDisplayValue(slug)).toBeInTheDocument()

//         // ✅ 5. Submit (no act needed!)
//         await user.click(
//             screen.getByRole("button", { name: /add category/i })
//         )

//         // ✅ 6. Wait for dialog to close
//         await waitFor(() => {
//             expect(
//                 screen.queryByPlaceholderText("Enter category name")
//             ).not.toBeInTheDocument()
//         })

//         // ✅ 7. Wait for new category to appear in table
//         await waitFor(() => {
//             expect(screen.getByText(name)).toBeInTheDocument()
//         })

//         // ✅ 8. Check count increased
//         const newButtons = screen.getAllByRole("button", { name: /edit/i })
//         expect(newButtons.length).toEqual(6)
//     })
// })
