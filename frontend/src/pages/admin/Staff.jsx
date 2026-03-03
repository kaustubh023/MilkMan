import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    email: "",
    full_name: "",
    phone: "",
    password: "",
    is_active: true,
  });

  const load = () => {
    setLoading(true);
    api
      .get("auth/staff/")
      .then((res) => setStaff(res.data))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () =>
    setForm({ id: null, email: "", full_name: "", phone: "", password: "", is_active: true });

  const saveStaff = async () => {
    const payload = {
      email: form.email,
      full_name: form.full_name,
      phone: form.phone || null,
      is_active: form.is_active,
    };
    if (form.password) payload.password = form.password;
    if (form.id) {
      await api.put(`auth/staff/${form.id}/`, payload);
    } else {
      await api.post("auth/staff/", payload);
    }
    resetForm();
    load();
  };

  const editStaff = (s) => {
    setForm({
      id: s.id,
      email: s.email,
      full_name: s.full_name || "",
      phone: s.phone || "",
      password: "",
      is_active: s.is_active,
    });
  };

  const toggleActive = async (s) => {
    await api.put(`auth/staff/${s.id}/`, {
      email: s.email,
      full_name: s.full_name,
      phone: s.phone,
      is_active: !s.is_active,
    });
    load();
  };

  const delStaff = async (id) => {
    await api.delete(`auth/staff/${id}/`);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Staff</h1>

      <div className="rounded-xl border bg-white p-4 mb-6">
        <div className="font-semibold mb-3">{form.id ? "Edit staff" : "Create staff"}</div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="password"
            className="border rounded px-3 py-2"
            placeholder={form.id ? "New password (optional)" : "Password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveStaff}>
              {form.id ? "Update" : "Create"}
            </button>
            {form.id ? (
              <button className="border px-4 py-2 rounded" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : staff.length === 0 ? (
        <div className="text-gray-500">No staff members</div>
      ) : (
        <div className="space-y-3">
          {staff.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border bg-white p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{s.full_name || "(no name)"} </div>
                <div className="text-sm text-gray-600">{s.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {s.is_active ? "Active" : "Inactive"}
                </span>
                <button className="border px-3 py-2 rounded" onClick={() => editStaff(s)}>
                  Edit
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => toggleActive(s)}>
                  Toggle
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => delStaff(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminStaff;

