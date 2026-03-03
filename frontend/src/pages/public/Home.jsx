import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("products/")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center justify-center bg-white/10 rounded-2xl p-6">
              <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
                <path d="M9 3h6l1 2v4a4 4 0 0 1-8 0V5l1-2Z" stroke="white" strokeWidth="1.5" />
                <path d="M8 9v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Fresh dairy, delivered daily</h1>
              <p className="mt-2 text-white/90">Browse products and add Subscribe in seconds.</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
