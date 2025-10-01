import type { CategoryFormData } from "@/features/admin/categories/categories.validation";
import { axiosInstance } from "@/lib/axios";

export async function addProduct(formData:FormData) {
    return axiosInstance.post("/admin/products",formData,{
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    })
}    

export async function addCategory(data:CategoryFormData) {
    return axiosInstance.post("/admin/categories",data)
}

export async function updateCategory(id:string,data:CategoryFormData) {
    return axiosInstance.put(`/admin/categories/${id}`,data)
}