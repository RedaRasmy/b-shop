import { Link, Outlet } from "react-router-dom"

export default function App() {
    return (
        <div className="h-screen">
            <nav className="bg-blue-600 text-white p-4">
                <div className="flex space-x-6">
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>
                    <Link to="/products" className="hover:underline">
                        Products
                    </Link>
                    <Link to="/about" className="hover:underline">
                        About
                    </Link>
                </div>
            </nav>
            <main className="bg-blue-200">
                <Outlet />
            </main>
        </div>
    )
}
