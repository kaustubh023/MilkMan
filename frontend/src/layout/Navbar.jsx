import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, role, loading, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-[rgba(31,111,67,0.12)] text-[var(--brand-deep)]"
        : "text-slate-700 hover:bg-white/80 hover:text-[var(--brand-deep)]"
    }`;

  return (
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-5">
      <div className="app-section">
        <div className="glass-panel flex items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f6f43,#d9a441)] text-lg font-bold text-white shadow-lg">
              KP
            </span>
            <div>
              <div className="text-lg font-semibold tracking-tight">KP Fresh Dairy</div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Pure daily essentials</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            {isAuthenticated && role === "CUSTOMER" ? (
              <>
                <NavLink to="/subscriptions" className={navLinkClass}>
                  Subscriptions
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            ) : null}
            {isAuthenticated && role === "STAFF" ? (
              <NavLink to="/staff/profile" className={navLinkClass}>
                Staff Profile
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? null : !isAuthenticated ? (
              <>
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn-secondary hidden sm:inline-flex">
                  Sign up
                </Link>
              </>
            ) : (
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
