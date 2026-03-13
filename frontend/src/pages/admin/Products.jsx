import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    category_id: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("products/"), api.get("categories/")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.resolve().then(load);
  }, []);

  const createCategory = async () => {
    if (!newCategory.name.trim()) return;
    await api.post("categories/", {
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || null,
    });
    setNewCategory({ name: "", description: "" });
    const c = await api.get("categories/");
    setCategories(c.data);
  };

  const resetForm = () => {
    setForm({ id: null, name: "", price: "", stock: "", category_id: "", is_active: true });
    setImageFile(null);
  };

  const saveProduct = async () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("is_active", String(form.is_active));
    if (form.category_id) fd.append("category_id", form.category_id);
    if (imageFile) fd.append("image", imageFile);
    if (form.id) {
      await api.put(`products/${form.id}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    } else {
      await api.post("products/", fd, { headers: { "Content-Type": "multipart/form-data" } });
    }
    resetForm();
    load();
  };

  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category_id: p.category?.id ?? "",
      is_active: p.is_active,
    });
    setImageFile(null);
  };

  const delProduct = async (id) => {
    await api.delete(`products/${id}/`);
    load();
  };

  const toggleAvailability = async (p) => {
    await api.put(`products/${p.id}/`, {
      name: p.name,
      price: p.price,
      stock: p.stock,
      category_id: p.category?.id ?? null,
      is_active: !p.is_active,
    });
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="rounded-xl border bg-white p-4 mb-6">
        <div className="font-semibold mb-3">Create category</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Description (optional)"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <button className="bg-gray-900 text-white px-4 py-2 rounded" onClick={createCategory}>
            Add Category
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 mb-6">
        <div className="font-semibold mb-3">{form.id ? "Edit product" : "Create product"}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <select
            className="border rounded px-3 py-2"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            className="border rounded px-3 py-2"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveProduct}>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">
                  Rs. {p.price} | Stock {p.stock} | {p.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="border px-3 py-2 rounded" onClick={() => editProduct(p)}>
                  Edit
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => toggleAvailability(p)}>
                  Toggle
                </button>
                <button className="border px-3 py-2 rounded" onClick={() => delProduct(p.id)}>
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

export default AdminProducts;
