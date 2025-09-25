import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import LoadingPage from "./pages/loading"
import App from "./App"
import { ProtectedRoute } from "./components/protected-route"
import { PublicRoute } from "./components/public-route"

const RegisterPage = lazy(() => import("./pages/auth/register"))
const LoginPage = lazy(() => import("./pages/auth/login"))
const HomePage = lazy(() => import("./pages/home"))
const AboutPage = lazy(() => import("./pages/about"))
const CategoriesPage = lazy(() => import("./pages/categories"))
const ProductsPage = lazy(() => import("./pages/products"))
const AdminLayout = lazy(() => import("./pages/admin"))
const ProfilePage = lazy(() => import("./pages/profile"))
const AdminProductsPage = lazy(() => import("./pages/admin/products"))
const AdminOrdersPage = lazy(() => import("./pages/admin/orders"))
const AdminSettingsPage = lazy(() => import("./pages/admin/settings"))
const AdminCategoriesPage = lazy(() => import("./pages/admin/categories"))
const AdminCustomersPage = lazy(() => import("./pages/admin/customers"))
const AdminAnalyticsPage = lazy(() => import("./pages/admin/analytics"))
const AdminShippingPage = lazy(() => import("./pages/admin/shipping"))
const CartPage = lazy(() => import("./pages/cart"))
const WishlistPage = lazy(() => import("./pages/wishlist"))


export const router = createBrowserRouter([
    // Public Routes with Main Layout
    {
        path: "/",
        element: <App />,
        // errorElement: <NotFoundPage />,
        children: [
            {
                path: "/auth",
                // element: <></>,
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
            // Home & Discovery
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: "about",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AboutPage />
                    </Suspense>
                ),
            },
            {
                path: "contact",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <ContactPage /> */}
                    </Suspense>
                ),
            },

            // Product Routes
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
                                {/* <ProductDetailPage /> */}
                            </Suspense>
                        ),
                    },
                ],
            },

            // Category Routes
            {
                path: "categories",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                <CategoriesPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":categorySlug",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <CategoryPage /> */}
                            </Suspense>
                        ),
                    },
                ],
            },

            // Shopping Routes
            {
                path: "cart",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <CartPage />
                    </Suspense>
                ),
            },
            {
                path: "wishlist",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <WishlistPage />
                    </Suspense>
                ),
            },

            // Search & Discovery
            {
                path: "search",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <SearchPage /> */}
                    </Suspense>
                ),
            },

            // Legal Pages
            {
                path: "privacy-policy",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <PrivacyPolicyPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "terms-of-service",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <TermsPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "shipping-info",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <ShippingInfoPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "return-policy",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <ReturnPolicyPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "faq",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <FAQPage /> */}
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
        ],
    },

    // Checkout Routes with Checkout Layout (Protected)
    {
        path: "/checkout",
        element: (
            // <ProtectedRoute>
            //     <CheckoutLayout />
            // </ProtectedRoute>
            <></>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <CheckoutPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "shipping",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <CheckoutShippingPage /> */}
                    </Suspense>
                ),
            },
            {
                path: "payment",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <CheckoutPaymentPage /> */}
                    </Suspense>
                ),
            },
            // {
            //     path: "review",
            //     element: (
            //         <Suspense fallback={<PageLoader />}>
            //             <CheckoutReviewPage />
            //         </Suspense>
            //     ),
            // },
            {
                path: "success/:orderId",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <OrderSuccessPage /> */}
                    </Suspense>
                ),
            },
        ],
    },

    // Account Routes (Protected)
    {
        path: "/account",
        element: (
            // <ProtectedRoute>
            //     <MainLayout />
            // </ProtectedRoute>
            <></>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <AccountDashboard /> */}
                    </Suspense>
                ),
            },
            {
                path: "profile",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <ProfilePage /> */}
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
                                {/* <OrderHistoryPage /> */}
                            </Suspense>
                        ),
                    },
                    {
                        path: ":orderId",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <OrderDetailPage /> */}
                            </Suspense>
                        ),
                    },
                ],
            },
            // {
            //     path: "addresses",
            //     element: (
            //         <Suspense fallback={<PageLoader />}>
            //             <AddressesPage />
            //         </Suspense>
            //     ),
            // },
            // {
            //     path: "payment-methods",
            //     element: (
            //         <Suspense fallback={<PageLoader />}>
            //             <PaymentMethodsPage />
            //         </Suspense>
            //     ),
            // },
            {
                path: "wishlist",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <AccountWishlistPage /> */}
                    </Suspense>
                ),
            },
            // {
            //     path: "reviews",
            //     element: (
            //         <Suspense fallback={<PageLoader />}>
            //             <UserReviewsPage />
            //         </Suspense>
            //     ),
            // },
            {
                path: "settings",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        {/* <AccountSettingsPage /> */}
                    </Suspense>
                ),
            },
        ],
    },

    // Admin Routes (Admin Only)
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
                        {/* <AdminDashboard /> */}
                        <>dashboard</>
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
                                <AdminProductsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "new",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <AdminProductCreatePage /> */}
                            </Suspense>
                        ),
                    },
                    {
                        path: ":id/edit",
                        element: (
                            <Suspense fallback={<LoadingPage />}>
                                {/* <AdminProductEditPage /> */}
                            </Suspense>
                        ),
                    },
                ],
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
                                {/* <AdminOrderDetailPage /> */}
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
                path: "shipping",
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <AdminShippingPage />
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
                {/* <NotFoundPage /> */}
            </Suspense>
        ),
    },
])
