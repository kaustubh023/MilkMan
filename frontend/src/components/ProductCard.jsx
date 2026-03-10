import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function ProductCard({ product, onClick }) {
  const navigate = useNavigate();
  const inStock = product.stock > 0;
  const price = Number(product.price || 0);

  return (
    <div className="group section-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(34,47,39,0.12)]">
      <ProductImage name={product.name} image={product.image} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-[rgba(217,164,65,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
              Farm fresh
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Fresh dairy supply prepared for regular household delivery plans.
            </p>
          </div>
          <div className="rounded-2xl bg-[rgba(31,111,67,0.08)] px-3 py-2 text-right">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Starting at</div>
            <div className="text-xl font-semibold text-[var(--brand-deep)]">Rs. {price.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          {inStock ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              In stock: {product.stock}
            </span>
          ) : (
            <span className="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-700">
              Out of stock
            </span>
          )}
          <span className="text-slate-500">Daily delivery</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button className="btn-primary flex-1" onClick={() => navigate("/subscriptions")}>
            Subscribe
          </button>
          {onClick ? (
            <button className="btn-secondary" onClick={onClick}>
              Details
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
