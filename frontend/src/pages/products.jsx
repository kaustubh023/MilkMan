import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../layout/Navbar";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("products/")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Milk Products</h2>
          <p className="text-gray-600">Browse our fresh and curated dairy catalogue.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="group rounded-2xl border bg-white shadow hover:shadow-lg transition overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-1 text-gray-500">₹ {product.price}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                    Add to Cart
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
      </main>
    </div>
  );
};

export default Products;
