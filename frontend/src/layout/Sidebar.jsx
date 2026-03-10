import { NavLink } from "react-router-dom";

function Sidebar() {
  const base =
    "block rounded-2xl px-4 py-3 transition text-slate-200 hover:bg-white/10 hover:text-white";
  const active = "bg-white/12 text-white";

  return (
    <div className="w-full bg-[linear-gradient(180deg,#133723,#0f2418)] text-white md:min-h-screen md:w-72">
      <div className="p-6">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Admin area</div>
          <h2 className="mt-3 text-2xl font-bold">KP Fresh Dairy</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Manage products, subscriptions, and staff operations.</p>
        </div>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Products
          </NavLink>
          <NavLink to="/admin/subscriptions" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Subscriptions
          </NavLink>
          <NavLink to="/admin/staff" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
            Staff
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
