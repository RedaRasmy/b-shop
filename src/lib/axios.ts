import axios from "axios"

const isProd = import.meta.env.MODE === "production"
// const isTest = import.meta.env.MODE === "test"

export const axiosInstance = axios.create({
    baseURL: isProd ? import.meta.env.VITE_BACKEND_API_URL : "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

axiosInstance.interceptors.response.use(
    (response) => response, // successful responses pass through

    async (error) => {
        const originalRequest = error.config

        // Skip refresh logic for login/register endpoints
        if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register")
        ) {
            return Promise.reject(error)
        }

        // If refresh endpoint itself fails, don't retry
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error)
        }

        // Handle 401 for protected requests
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                // Attempt to refresh the access token
                await axiosInstance.post("/auth/refresh")
                return axiosInstance(originalRequest) // retry original request
            } catch (refreshError) {
                // Redirect or handle logout
                console.error("Refresh failed:", refreshError)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error) // all other errors
    }
)
