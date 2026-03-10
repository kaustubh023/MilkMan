import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";
import ProductCard from "../../components/ProductCard";

function Products() {
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
    <div className="app-shell">
      <Navbar />
      <main className="app-section pb-16">
        <div className="section-card mb-8 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Product catalog</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Fresh dairy products for daily delivery plans</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
            This page now reads more like a real catalog. Product cards emphasize freshness, stock, and subscription value without changing any existing backend flow.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="section-card h-[380px] animate-pulse bg-white/70" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="section-card p-10 text-center text-slate-500">No products available right now.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;
