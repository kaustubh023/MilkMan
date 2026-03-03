import { NavLink } from "react-router-dom";

function Sidebar() {
  const base =
    "block rounded px-3 py-2 hover:bg-gray-800 transition text-gray-200 hover:text-white";
  const active = "bg-gray-800 text-white";
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">KP Fresh Dairy</h2>
      <nav className="space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Products
        </NavLink>
        <NavLink
          to="/admin/subscriptions"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Subscriptions
        </NavLink>
        <NavLink
          to="/admin/staff"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          Staff
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar
