import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";

const statusStyles = {
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
  PENDING: "bg-amber-50 text-amber-700",
};

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
    <div className="app-shell">
      <Navbar />
      <main className="app-section pb-16">
        <div className="section-card mb-6 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Orders</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Track your recent purchases</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            One-time orders now have a dedicated history page with the same visual language as the rest of the storefront.
          </p>
        </div>

        {loading ? (
          <div className="section-card p-10 text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="section-card p-10 text-center">
            <div className="text-2xl font-semibold">No orders yet</div>
            <p className="mt-3 text-sm text-slate-500">Once you place a one-time order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="section-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xl font-semibold">Order #{order.id}</div>
                    <div className="mt-2 text-sm text-slate-500">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>
                      {order.status}
                    </span>
                    <div className="rounded-2xl bg-[rgba(31,111,67,0.08)] px-4 py-3 text-right">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Total</div>
                      <div className="mt-1 text-lg font-semibold text-[var(--brand-deep)]">
                        Rs. {Number(order.total_amount || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {order.order_items?.length ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {order.order_items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="rounded-[22px] bg-[rgba(247,243,234,0.92)] px-4 py-4">
                        <div className="font-semibold">{item.product}</div>
                        <div className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</div>
                        <div className="mt-2 text-sm font-medium">Rs. {Number(item.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
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
