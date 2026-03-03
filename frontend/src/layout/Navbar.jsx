import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">D</span>
          <span className="text-xl font-semibold">KP Fresh Dairy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">Products</Link>
          {isAuthenticated && role === "CUSTOMER" ? (
            <>
              <Link to="/subscriptions" className="text-gray-700 hover:text-blue-600 transition">Subscriptions</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">Profile</Link>
            </>
          ) : null}
          {isAuthenticated && role === "STAFF" ? (
            <Link to="/staff/profile" className="text-gray-700 hover:text-blue-600 transition">Staff Profile</Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          {loading ? null : !isAuthenticated ? (
            <>
              <Link to="/login" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                Login
              </Link>
              <Link to="/signup" className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50 transition">
                Sign up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
