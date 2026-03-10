import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("orders/dashboard/")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="section-card mb-6 p-8">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Admin dashboard</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operational snapshot</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          This dashboard now presents the same statistics with stronger hierarchy so the admin side feels more complete and intentional.
        </p>
      </div>

      {loading ? (
        <div className="section-card p-10 text-slate-500">Loading dashboard...</div>
      ) : !stats ? (
        <div className="section-card p-10 text-slate-500">Failed to load stats.</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="stat-card">
              <div className="text-sm text-slate-500">Total customers</div>
              <div className="mt-2 text-3xl font-semibold">{stats.total_customers}</div>
              <div className="mt-2 text-sm text-slate-500">Registered customer accounts.</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-slate-500">Total orders</div>
              <div className="mt-2 text-3xl font-semibold">{stats.total_orders}</div>
              <div className="mt-2 text-sm text-slate-500">Orders processed through the system.</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-slate-500">Total revenue</div>
              <div className="mt-2 text-3xl font-semibold">Rs. {Number(stats.total_revenue || 0).toFixed(2)}</div>
              <div className="mt-2 text-sm text-slate-500">Combined revenue recorded so far.</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-slate-500">Active subscriptions</div>
              <div className="mt-2 text-3xl font-semibold">{stats.active_subscriptions}</div>
              <div className="mt-2 text-sm text-slate-500">Plans currently marked active.</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="section-card p-6">
              <div className="text-lg font-semibold">Admin focus</div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                The next safe improvements here are charts, top products, daily collections, and subscription conversion trends.
              </p>
            </div>
            <div className="section-card p-6">
              <div className="text-lg font-semibold">Current state</div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                API output is unchanged in this pass. This is a presentation upgrade only, keeping your existing backend contract intact.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
