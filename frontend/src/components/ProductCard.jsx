import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function ProductCard({ product, onClick }) {
  const navigate = useNavigate();
  const inStock = product.stock > 0;

  return (
    <div className="group rounded-2xl border bg-white shadow hover:shadow-lg transition overflow-hidden">
      <ProductImage name={product.name} image={product.image} />
      <div className="p-5">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <div className="mt-1 text-gray-500">₹ {product.price}</div>
        <div className="mt-1 text-sm">
          {inStock ? (
            <span className="text-green-600">In stock: {product.stock}</span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            onClick={() => navigate("/subscriptions")}
          >
            Subscribe
          </button>
          {onClick ? (
            <button
              className="rounded-lg border px-4 py-2 hover:bg-gray-50 transition"
              onClick={onClick}
            >
              Details
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
