import { axiosInstance } from "@/lib/axios";

export async function addProduct(formData:FormData) {
    return axiosInstance.post("/admin/products",formData,{
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    })
}    