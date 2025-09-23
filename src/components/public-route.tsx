import { useAuth } from "@/hooks/use-auth";
import LoadingPage from "@/pages/loading";
import { Navigate } from "react-router-dom";

export function PublicRoute({ children , redirectTo}: { children: React.ReactNode ; redirectTo?:string}) {
  const { isAuthenticated , loading } = useAuth(); // get current auth state

  if (loading) return <LoadingPage/>
  if (isAuthenticated) {
    // Already logged in, redirect to home or dashboard
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return <>{children}</>;
}
