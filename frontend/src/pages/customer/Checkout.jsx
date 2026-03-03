import Navbar from "../../layout/Navbar";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const { items, checkout } = useCart();
  const total = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="rounded-xl border bg-white p-6">
          {items.length === 0 ? (
            <div className="text-gray-600">Your cart is empty</div>
          ) : (
            <>
              <ul className="space-y-2 mb-4">
                {items.map((i) => (
                  <li key={i.product.id} className="flex items-center justify-between">
                    <span>{i.product.name} × {i.quantity}</span>
                    <span>₹ {(Number(i.product.price) * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="font-semibold">Total</div>
                <div className="font-semibold">₹ {total.toFixed(2)}</div>
              </div>
              <button
                onClick={checkout}
                className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;

