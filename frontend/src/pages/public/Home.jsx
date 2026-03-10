import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../layout/Navbar";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlights = [
    { title: "Daily route delivery", copy: "Morning doorstep delivery with a clean and predictable schedule." },
    { title: "Simple subscriptions", copy: "Start monthly plans in seconds and manage active items in one place." },
    { title: "Trusted freshness", copy: "Milk, paneer, ghee, and staples presented with consistent quality." },
  ];
  const featuredProducts = products.slice(0, 4);

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
      <main className="space-y-12 pb-16">
        <section className="app-section">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="section-card overflow-hidden p-8 md:p-10">
              <div className="mb-4 inline-flex rounded-full bg-[rgba(31,111,67,0.1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-deep)]">
                Fresh dairy subscriptions
              </div>
              <h1 className="page-title max-w-2xl">
                Make your dairy app feel like a premium household service.
              </h1>
              <p className="page-copy mt-5 max-w-2xl">
                KP Fresh Dairy now presents products, subscriptions, and delivery value in a cleaner,
                more confident storefront. Customers can browse quickly and understand the service at a glance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/products" className="btn-primary">
                  Explore products
                </a>
                <a href="/signup" className="btn-secondary">
                  Create account
                </a>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="stat-card">
                  <div className="text-sm text-slate-500">Delivery promise</div>
                  <div className="mt-2 text-2xl font-semibold">7 days</div>
                  <div className="mt-1 text-sm text-slate-500">Built for daily household supply.</div>
                </div>
                <div className="stat-card">
                  <div className="text-sm text-slate-500">Plan setup</div>
                  <div className="mt-2 text-2xl font-semibold">Under 1 min</div>
                  <div className="mt-1 text-sm text-slate-500">Fast subscription creation flow.</div>
                </div>
                <div className="stat-card">
                  <div className="text-sm text-slate-500">Popular items</div>
                  <div className="mt-2 text-2xl font-semibold">{products.length || 4}+</div>
                  <div className="mt-1 text-sm text-slate-500">Milk, paneer, ghee, and more.</div>
                </div>
              </div>
            </div>

            <div className="section-card flex flex-col justify-between p-8">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Why it works</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">A clearer service story builds trust.</div>
              </div>
              <div className="mt-8 space-y-4">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-[24px] bg-[rgba(247,243,234,0.9)] p-5">
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="app-section">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Featured catalog</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Products customers can subscribe to today</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Showcase the core dairy products with clearer pricing and stock information so the first screen already feels complete.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="section-card h-[380px] animate-pulse bg-white/70" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="section-card p-10 text-center text-slate-500">No products available right now.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        <section className="app-section">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="section-card p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Experience</div>
              <h3 className="mt-3 text-2xl font-semibold">What to add next</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Pause or resume subscriptions, ratings, and delivery slots will make the product feel much more complete.
              </p>
            </div>
            <div className="section-card p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Operations</div>
              <h3 className="mt-3 text-2xl font-semibold">Admin visibility</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Stronger dashboards help staff see customer growth, active plans, and revenue trends with less friction.
              </p>
            </div>
            <div className="section-card p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Trust</div>
              <h3 className="mt-3 text-2xl font-semibold">Sharper presentation</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Better spacing, empty states, and consistent cards immediately make the app look more production-ready.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
