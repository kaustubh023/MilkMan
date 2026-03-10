import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";

function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(true);
  const activeSubs = subs.filter((sub) => sub.is_active);
  const monthlyValue = activeSubs.reduce((sum, sub) => sum + Number(sub.total_price || 0), 0);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("subscriptions/"), api.get("products/")])
      .then(([s, p]) => {
        setSubs(s.data);
        setProducts(p.data);
      })
      .catch(() => {
        setSubs([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const createSub = async () => {
    if (!productId || quantity <= 0) return;
    await api.post("subscriptions/", { product: productId, quantity, months });
    setProductId("");
    setQuantity(1);
    setMonths(1);
    load();
  };

  const cancelSub = async (id) => {
    await api.patch(`subscriptions/${id}/`, { is_active: false });
    load();
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-section max-w-6xl pb-16">
        <div className="section-card mb-6 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Subscriptions</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Manage recurring dairy plans in one place</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            This screen keeps the same API behavior but gives customers a clearer workflow and better status overview.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <div className="text-sm text-slate-500">Active plans</div>
            <div className="mt-2 text-3xl font-semibold">{activeSubs.length}</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-slate-500">Catalog items</div>
            <div className="mt-2 text-3xl font-semibold">{products.length}</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-slate-500">Projected plan value</div>
            <div className="mt-2 text-3xl font-semibold">Rs. {monthlyValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="section-card mb-6 p-6">
          <div className="mb-4 text-lg font-semibold">Create a new subscription</div>
          <div className="grid gap-3 md:grid-cols-[1.5fr_0.6fr_0.7fr_auto]">
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="input-shell">
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - Rs. {p.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || "1", 10))}
              className="input-shell"
            />
            <input
              type="number"
              min={1}
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value || "1", 10))}
              className="input-shell"
              placeholder="Months"
              title="Number of months"
            />
            <button className="btn-primary" onClick={createSub}>
              Create plan
            </button>
          </div>
        </div>

        {loading ? (
          <div className="section-card p-10 text-slate-500">Loading subscriptions...</div>
        ) : subs.length === 0 ? (
          <div className="section-card p-10 text-slate-500">No subscriptions yet.</div>
        ) : (
          <div className="space-y-4">
            {subs.map((s) => (
              <div key={s.id} className="section-card p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">Subscription #{s.id}</div>
                    <div className="mt-1 text-sm text-slate-500">Quantity: {s.quantity}</div>
                    <div className="mt-1 text-sm text-slate-500">Status: {s.is_active ? "Currently running" : "Stopped"}</div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {"months" in s ? (
                      <div className="rounded-2xl bg-[rgba(31,111,67,0.08)] px-4 py-3 text-sm text-slate-600">
                        <div>Months: {s.months}</div>
                        <div>Total: Rs. {Number(s.total_price || 0).toFixed(2)}</div>
                      </div>
                    ) : null}
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                    {s.is_active ? (
                      <button className="btn-secondary" onClick={() => cancelSub(s.id)}>
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Subscriptions;
