import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "./useAuth";
import { CartContext } from "./CartContextValue";

function normalizeProduct(product) {
  if (!product) return null;
  if (typeof product === "object") {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      image: product.image ?? null,
      stock: Number(product.stock || 0),
    };
  }
  return { id: product, name: "", price: 0, image: null, stock: 0 };
}

function normalizeLocalItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((item) => {
      const product = normalizeProduct(item.product);
      const quantity = Number(item.quantity || 0);
      if (!product?.id || quantity <= 0) return null;
      return { product, quantity };
    })
    .filter(Boolean);
}

function normalizeServerItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      product: {
        id: item.product,
        name: item.product_name,
        price: Number(item.price || 0),
        image: item.image ?? null,
        stock: Number(item.stock || 0),
      },
      quantity: Number(item.quantity || 0),
    }))
    .filter((item) => item.product.id && item.quantity > 0);
}

function mergeItems(localItems, serverItems) {
  const merged = new Map();
  [...serverItems, ...localItems].forEach((item) => {
    const existing = merged.get(item.product.id);
    if (!existing) {
      merged.set(item.product.id, item);
      return;
    }
    merged.set(item.product.id, {
      product: {
        ...existing.product,
        ...item.product,
        name: item.product.name || existing.product.name,
        image: item.product.image || existing.product.image,
        price: item.product.price || existing.product.price,
        stock: item.product.stock || existing.product.stock,
      },
      quantity: existing.quantity + item.quantity,
    });
  });
  return Array.from(merged.values());
}

const readLocalItems = () => {
  try {
    const raw = localStorage.getItem("cart_items");
    if (!raw) return [];
    return normalizeLocalItems(JSON.parse(raw));
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setItems(readLocalItems());
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated || role !== "CUSTOMER") return;

    let ignore = false;

    const syncCart = async () => {
      setSyncing(true);
      const localItems = readLocalItems();
      try {
        const res = await api.get("cart/");
        const serverItems = normalizeServerItems(res.data?.items || []);
        const mergedItems = localItems.length ? mergeItems(localItems, serverItems) : serverItems;

        if (localItems.length) {
          await api.delete("cart/clear/");
          await api.post("cart/sync/", {
            items: mergedItems.map((item) => ({
              product: item.product.id,
              quantity: item.quantity,
            })),
          });
        }

        if (!ignore) {
          setItems(mergedItems);
        }
      } catch {
        if (!ignore) {
          setItems(localItems);
        }
      } finally {
        if (!ignore) {
          setSyncing(false);
        }
      }
    };

    void syncCart();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, role]);

  const addToCart = async (product, qty = 1) => {
    const nextQuantity = Number(qty || 1);
    if (!product?.id || nextQuantity <= 0) return;

    setItems((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: updated[index].quantity + nextQuantity };
        return updated;
      }
      return [...prev, { product: normalizeProduct(product), quantity: nextQuantity }];
    });

    if (isAuthenticated && role === "CUSTOMER") {
      try {
        await api.post("cart/add/", { product: product.id, quantity: nextQuantity });
      } catch {
        return null;
      }
    }
  };

  const removeFromCart = async (productId) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (isAuthenticated && role === "CUSTOMER") {
      try {
        await api.delete("cart/remove/", { data: { product: productId, quantity: 1 } });
      } catch {
        return null;
      }
    }
  };

  const updateQuantity = async (productId, qty) => {
    const nextQuantity = Number(qty || 0);
    if (nextQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: nextQuantity } : item))
    );

    if (isAuthenticated && role === "CUSTOMER") {
      try {
        await api.patch("cart/update_item/", { product: productId, quantity: nextQuantity });
      } catch {
        return null;
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (isAuthenticated && role === "CUSTOMER") {
      try {
        await api.delete("cart/clear/");
      } catch {
        return null;
      }
    }
  };

  const checkout = async () => {
    if (!items.length) return;

    if (!isAuthenticated || role !== "CUSTOMER") {
      localStorage.setItem("redirectTo", "/checkout");
      navigate("/login");
      return;
    }

    const orderItems = items.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
    }));

    await api.post("orders/", { items: orderItems });
    await clearCart();
    navigate("/orders");
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0);

  const value = {
    items,
    cartCount,
    cartTotal,
    syncing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
