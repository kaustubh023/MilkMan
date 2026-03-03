import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("orders/")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-500">No orders yet</div>
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
                <div className="mt-2 text-sm text-gray-600">
                  Total: ₹ {o.total_amount}
                </div>
                {o.order_items?.length ? (
                  <ul className="mt-2 text-sm text-gray-700 list-disc pl-6">
                    {o.order_items.map((it, idx) => (
                      <li key={idx}>
                        {it.product} × {it.quantity} — ₹ {it.price}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;

