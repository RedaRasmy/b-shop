import type {
    AdminCategory,
    CategoryFormData,
} from "@/features/admin/categories/categories.validation"

export const insertCategory: CategoryFormData = {
    name: "Home & Living",
    description:
        "Explore our wide range of home and living essentials for every space.",
    slug: "home-living",
    status: "inactive",
}

export const mockedCategories: AdminCategory[] = [
    {
        id: "9bce1247-f1a3-44c3-9d1e-7c1c1a8a4e27",
        name: "Electronics",
        description: "Latest gadgets, devices, and accessories.",
        slug: "electronics",
        status: "active",
        productsCount: 142,
        createdAt: "2024-03-10T14:23:00Z",
        updatedAt: "2025-09-20T09:15:00Z",
    },
    {
        id: "5cfb3c29-e40d-42b2-85a7-d9dc6201e6a9",
        name: "Fashion",
        description: "Trending outfits and fashion accessories.",
        slug: "fashion",
        status: "active",
        productsCount: 87,
        createdAt: "2024-05-22T08:45:00Z",
        updatedAt: "2025-08-11T17:32:00Z",
    },
    {
        id: "d4e8391e-79e6-4b7d-b343-fd6b24963f71",
        name: "Books",
        description: "A wide selection of books across all genres.",
        slug: "books",
        status: "inactive",
        productsCount: 0,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2025-07-25T14:20:00Z",
    },
    {
        id: "0f8fad5b-d9cb-469f-a165-70867728950e",
        name: "Sports & Outdoors",
        description: "Gear and equipment for your active lifestyle.",
        slug: "sports-outdoors",
        status: "active",
        productsCount: 56,
        createdAt: "2024-12-10T10:15:00Z",
        updatedAt: "2025-10-05T11:55:00Z",
    },
    {
        id: "c1a4bcb6-36a7-4c15-b93a-408bf2cd1a9a",
        name: "Clearance",
        description: "Deep discounts on discontinued and overstocked items.",
        slug: "clearance",
        status: "inactive",
        productsCount: 3,
        createdAt: "2023-07-19T13:35:00Z",
        updatedAt: "2024-09-01T08:50:00Z",
    },
]
