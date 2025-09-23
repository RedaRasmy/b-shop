import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "/api"
            : import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

axiosInstance.interceptors.response.use(
    (response) => response, // Directly return successful responses.
    async (error) => {
        const originalRequest = error.config

        // If refresh endpoint itself fails, don't retry
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error)
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Mark the request as retried to avoid infinite loops.
            try {
                // Make a request to your auth server to refresh the token.
                await axiosInstance.post("/auth/refresh")

                return axiosInstance(originalRequest) // Retry the original request with the new access token.
            } catch (refreshError) {
                // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                console.error("Token refresh failed:", refreshError)
                // window.location.href = "/auth/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error) // For all other errors, return the error as is.
    }
)
