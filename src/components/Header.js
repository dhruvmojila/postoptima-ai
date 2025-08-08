import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Hide header on login/signup for logged-out users
  if (!user && ["/login", "/signup"].includes(router.pathname)) return null;

  // Hide header on login/signup for logged-in users (shouldn't happen, but fallback)
  if (user && ["/login", "/signup"].includes(router.pathname)) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="w-full bg-gray-950/90 border-b border-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold text-purple-400 hover:text-purple-300 transition"
          >
            PostOptima AI
          </Link>
          <NavLink href="/" label="Home" current={router.pathname === "/"} />
          {user && (
            <NavLink
              href="/dashboard"
              label="Dashboard"
              current={router.pathname === "/dashboard"}
            />
          )}
          {user && (
            <NavLink
              href="/analytics"
              label="Analytics"
              current={router.pathname === "/analytics"}
            />
          )}
          <NavLink
            href="/pricing"
            label="Pricing"
            current={router.pathname === "/pricing"}
          />
        </div>
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-purple-400 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label, current }) {
  return (
    <Link
      href={href}
      className={`px-2 py-1 rounded transition font-medium ${
        current
          ? "text-purple-400 underline"
          : "text-gray-200 hover:text-purple-300"
      }`}
    >
      {label}
    </Link>
  );
}
