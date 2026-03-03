import { useCart } from "../../context/CartContext";
import Navbar from "../../layout/Navbar";

function Cart() {
  const { items, updateQuantity, removeFromCart, checkout } = useCart();
  const total = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-gray-500">Your cart is empty</div>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i.product.id}
                className="flex items-center justify-between rounded-xl border bg-white p-4"
              >
                <div>
                  <div className="font-semibold">{i.product.name}</div>
                  <div className="text-sm text-gray-600">
                    ₹ {i.product.price} x {i.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) =>
                      updateQuantity(i.product.id, parseInt(e.target.value || "1", 10))
                    }
                    className="w-20 border rounded px-2 py-1"
                  />
                  <button
                    className="px-3 py-2 rounded border hover:bg-gray-50"
                    onClick={() => removeFromCart(i.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-lg font-semibold">Total: ₹ {total.toFixed(2)}</div>
              <button
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                onClick={checkout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;

