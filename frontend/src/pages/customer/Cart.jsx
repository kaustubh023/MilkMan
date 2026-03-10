import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../layout/Navbar";
import ProductImage from "../../components/ProductImage";

function Cart() {
  const { items, cartCount, cartTotal, updateQuantity, removeFromCart, syncing } = useCart();
  const deliveryFee = items.length ? 30 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-section pb-16">
        <div className="section-card mb-6 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Cart</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Review your quick order</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            This cart flow sits alongside subscriptions so customers can place one-time dairy orders without affecting the existing recurring plan flow.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="section-card p-10 text-center">
            <div className="text-2xl font-semibold">Your cart is empty</div>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Add a few dairy items from the product catalog. The cart stays available for guests and syncs after customer login.
            </p>
            <div className="mt-6">
              <Link to="/products" className="btn-primary">
                Explore products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="section-card p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="w-full overflow-hidden rounded-[22px] sm:w-48">
                      <ProductImage name={item.product.name} image={item.product.image} />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-xl font-semibold">{item.product.name}</div>
                          <div className="mt-2 text-sm text-slate-500">
                            One-time order item for same visual flow as the rest of the storefront.
                          </div>
                        </div>
                        <div className="rounded-2xl bg-[rgba(31,111,67,0.08)] px-4 py-3 text-right">
                          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Subtotal</div>
                          <div className="mt-1 text-lg font-semibold text-[var(--brand-deep)]">
                            Rs. {(Number(item.product.price || 0) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-500">Rs. {Number(item.product.price || 0).toFixed(2)} per unit</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-2 py-2">
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(31,111,67,0.08)] text-lg"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(31,111,67,0.08)] text-lg"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button className="btn-secondary" onClick={() => removeFromCart(item.product.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="section-card h-fit p-6 lg:sticky lg:top-28">
              <div className="text-lg font-semibold">Cart summary</div>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-semibold">{cartCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delivery fee</span>
                  <span className="font-semibold">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-lg font-semibold">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Link to="/checkout" className="btn-primary w-full">
                  Continue to checkout
                </Link>
                <Link to="/products" className="btn-secondary w-full">
                  Add more items
                </Link>
              </div>
              {syncing ? <div className="mt-4 text-xs text-slate-500">Syncing cart with your account...</div> : null}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
