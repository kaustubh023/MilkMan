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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : !stats ? (
        <div className="text-gray-500">Failed to load stats</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Total Customers</div>
            <div className="text-2xl font-semibold">{stats.total_customers}</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-semibold">{stats.total_orders}</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-semibold">₹ {stats.total_revenue}</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="text-sm text-gray-500">Active Subscriptions</div>
            <div className="text-2xl font-semibold">{stats.active_subscriptions}</div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;

