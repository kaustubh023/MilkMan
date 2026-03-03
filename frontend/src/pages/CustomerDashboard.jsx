import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../layout/Navbar";

function CustomerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("products/")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 text-white px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Fresh Dairy, Delivered Daily</h1>
          <p className="mt-3 text-blue-50">Browse our bestsellers and manage your daily subscriptions.</p>
          <div className="mt-6">
            <a href="#products" className="inline-flex items-center rounded-xl bg-white/90 px-5 py-3 text-blue-700 hover:bg-white transition">
              Explore Products
            </a>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Popular Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group rounded-2xl border bg-white shadow hover:shadow-lg transition overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-gray-500">₹ {p.price}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                    Add
                  </button>
                  <button className="rounded-lg border px-4 py-2 hover:bg-gray-50 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No products available.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
