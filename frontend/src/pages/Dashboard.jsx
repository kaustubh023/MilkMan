import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import api from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_orders: 0,
    total_revenue: 0,
    active_subscriptions: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("orders/dashboard/");
        setStats(response.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500 text-sm">Total Customers</h3>
              <p className="text-3xl font-bold mt-2">
                {stats.total_customers}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500 text-sm">Total Orders</h3>
              <p className="text-3xl font-bold mt-2">
                {stats.total_orders}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500 text-sm">Revenue</h3>
              <p className="text-3xl font-bold mt-2">
                ₹ {stats.total_revenue}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500 text-sm">Active Subscriptions</h3>
              <p className="text-3xl font-bold mt-2">
                {stats.active_subscriptions}
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;