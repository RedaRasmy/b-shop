import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import LoadingPage from "./pages/loading"
import App from "./App"
import { ProtectedRoute } from "./features/auth/components/protected-route"
import { PublicRoute } from "./features/auth/components/public-route"
import OrderSuccessPage from "@/pages/order-success"
import AdminDashboard from "@/pages/admin/dashboard"

const NotFoundPage = lazy(() => import("./pages/not-found"))
const OrderPage = lazy(() => import("./pages/order"))
const RegisterPage = lazy(() => import("./pages/auth/register"))
const LoginPage = lazy(() => import("./pages/auth/login"))
const HomePage = lazy(() => import("./pages/home"))
const ProductsPage = lazy(() => import("./pages/products"))
const ProductDetailPage = lazy(() => import("./pages/products/product-detail"))
const AdminLayout = lazy(() => import("./pages/admin"))
const ProfilePage = lazy(() => import("./pages/profile"))
const AdminProductsPage = lazy(() => import("./pages/admin/products"))
const AdminOrdersPage = lazy(() => import("./pages/admin/orders"))
const AdminSettingsPage = lazy(() => import("./pages/admin/settings"))
const AdminCategoriesPage = lazy(() => import("./pages/admin/categories"))
const AdminCustomersPage = lazy(() => import("./pages/admin/customers"))
const AdminAnalyticsPage = lazy(() => import("./pages/admin/analytics"))
const CartPage = lazy(() => import("./pages/cart"))
const OrderDetailsPage = lazy(() => import("./pages/admin/order-details"))

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/auth",
                children: [
                    {
                        index: true,
                        element: <Navigate to={"login"} replace />,
                    },
                    {
                        path: "login",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <PublicRoute redirectTo="/profile">
                                    <LoginPage />
                                </PublicRoute>
                            </Suspense>
                        ),
                    },
                    {
                        path: "register",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <PublicRoute redirectTo="/profile">
                                    <RegisterPage />
                                </PublicRoute>
                            </Suspense>
                        ),
                    },
                    {
                        path: "forgot-password",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <ForgotPasswordPage /> */}
                            </Suspense>
                        ),
                    },
                    {
                        path: "reset-password/:token",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <ResetPasswordPage /> */}
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: "products",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <ProductsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":slug",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <ProductDetailPage />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "cart",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <CartPage />
                    </Suspense>
                ),
            },
            {
                path: "profile",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <ProtectedRoute
                            requiredRole="customer"
                            roleFallback="/admin"
                        >
                            <ProfilePage />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: "/order",
                element: <OrderPage />,
            },
            {
                path: "/order-success/:token",
                element: <OrderSuccessPage />,
            },
        ],
    },

    // Admin Routes
    {
        path: "/admin",
        element: (
            <ProtectedRoute requiredRole="admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminDashboard />
                    </Suspense>
                ),
            },
            {
                path: "products",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminProductsPage />
                    </Suspense>
                ),
            },
            {
                path: "orders",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <AdminOrdersPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":id",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <OrderDetailsPage />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "customers",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminCustomersPage />
                    </Suspense>
                ),
            },
            {
                path: "analytics",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminAnalyticsPage />
                    </Suspense>
                ),
            },
            {
                path: "categories",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminCategoriesPage />
                    </Suspense>
                ),
            },
            {
                path: "settings",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminSettingsPage />
                    </Suspense>
                ),
            },
        ],
    },

    // 404 Route
    {
        path: "*",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <NotFoundPage />
            </Suspense>
        ),
    },
])
