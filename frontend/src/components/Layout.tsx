import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../hooks/auth/useAuth";

export function Layout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
