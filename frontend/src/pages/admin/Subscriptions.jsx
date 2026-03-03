import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("subscriptions/")
      .then((res) => setSubs(res.data))
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const runDaily = async () => {
    await api.post("subscriptions/run_daily/");
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={runDaily}>
          Run Daily Processor
        </button>
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
                <div className="font-semibold">Subscription #{s.id}</div>
                <div className="text-sm text-gray-600">Qty: {s.quantity}</div>
                {"months" in s ? (
                  <div className="text-sm text-gray-600">Months: {s.months} • Total: ₹ {s.total_price}</div>
                ) : null}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                }`}
              >
                {s.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminSubscriptions;
