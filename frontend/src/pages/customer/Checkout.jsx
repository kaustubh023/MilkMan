import { Link } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { useCart } from "../../context/useCart";

function Checkout() {
  const { items, cartTotal, checkout } = useCart();
  const deliveryFee = items.length ? 30 : 0;
  const platformFee = items.length ? 10 : 0;
  const grandTotal = cartTotal + deliveryFee + platformFee;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-section pb-16">
        <div className="section-card mb-6 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Checkout</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Confirm your dairy order</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            The order flow is intentionally lightweight. Customers can review line items, totals, and place an order without changing the subscription system.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="section-card p-10 text-center">
            <div className="text-2xl font-semibold">No items ready for checkout</div>
            <p className="mt-3 text-sm text-slate-500">Add products to the cart first, then return here to place a one-time order.</p>
            <div className="mt-6">
              <Link to="/products" className="btn-primary">
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="section-card p-6">
                <div className="text-lg font-semibold">Delivery details</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input className="input-shell" placeholder="Full name" />
                  <input className="input-shell" placeholder="Phone number" />
                  <input className="input-shell md:col-span-2" placeholder="Delivery address" />
                  <input className="input-shell" placeholder="Preferred slot" />
                  <input className="input-shell" placeholder="Notes for delivery partner" />
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  These fields are UI-only in this phase. Order placement still uses your current backend order model.
                </p>
              </div>

              <div className="section-card p-6">
                <div className="text-lg font-semibold">Items in this order</div>
                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between rounded-[22px] bg-[rgba(247,243,234,0.92)] px-4 py-4">
                      <div>
                        <div className="font-semibold">{item.product.name}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          Rs. {Number(item.product.price || 0).toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="text-right font-semibold">
                        Rs. {(Number(item.product.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="section-card h-fit p-6 lg:sticky lg:top-28">
              <div className="text-lg font-semibold">Payment summary</div>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Items total</span>
                  <span className="font-semibold">Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delivery fee</span>
                  <span className="font-semibold">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Platform fee</span>
                  <span className="font-semibold">Rs. {platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">To pay</span>
                    <span className="text-lg font-semibold">Rs. {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={checkout} className="btn-primary mt-6 w-full">
                Place order
              </button>
              <Link to="/cart" className="btn-secondary mt-3 w-full">
                Back to cart
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
