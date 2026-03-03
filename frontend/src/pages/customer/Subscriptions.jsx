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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

        <div className="rounded-xl border bg-white p-4 mb-6">
          <div className="font-semibold mb-3">New subscription</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹ {p.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || "1", 10))}
              className="border rounded px-3 py-2 w-32"
            />
            <input
              type="number"
              min={1}
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value || "1", 10))}
              className="border rounded px-3 py-2 w-36"
              placeholder="Months"
              title="Number of months"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={createSub}
            >
              Create
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : subs.length === 0 ? (
          <div className="text-gray-500">No subscriptions</div>
        ) : (
          <div className="space-y-4">
            {subs.map((s) => (
              <div key={s.id} className="rounded-xl border bg-white p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">#{s.id}</div>
                  <div className="text-sm text-gray-600">Qty: {s.quantity}</div>
                  {"months" in s ? (
                    <div className="text-sm text-gray-600">Months: {s.months} • Total: ₹ {s.total_price}</div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                  {s.is_active ? (
                    <button
                      className="px-3 py-2 rounded border hover:bg-gray-50"
                      onClick={() => cancelSub(s.id)}
                    >
                      Cancel
                    </button>
                  ) : null}
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
