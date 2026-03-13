import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("orders/")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.resolve().then(load);
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`orders/${id}/update_status/`, { status });
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No orders</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order #{o.id}</div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    o.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : o.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">Total: Rs. {o.total_amount}</div>
              <div className="mt-3 flex items-center gap-2">
                <button className="border px-3 py-2 rounded" onClick={() => updateStatus(o.id, "PENDING")}>
                  Mark Pending
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => updateStatus(o.id, "DELIVERED")}>
                  Mark Delivered
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => updateStatus(o.id, "CANCELLED")}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;
