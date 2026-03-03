import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart_items");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addToCart = async (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
    if (isAuthenticated && role === "CUSTOMER") {
      try {
        await api.post("cart/add/", { product: product.id, quantity: qty });
      } catch {}
    }
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const checkout = async () => {
    if (!isAuthenticated || role !== "CUSTOMER") {
      localStorage.setItem("redirectTo", "/checkout");
      navigate("/login");
      return;
    }
    let orderItems = items.map((i) => ({ product: i.product.id, quantity: i.quantity }));
    try {
      const cartRes = await api.get("cart/");
      if (cartRes.data?.items?.length) {
        orderItems = cartRes.data.items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
        }));
      }
    } catch {}
    await api.post("orders/", { items: orderItems });
    try {
      await api.delete("cart/clear/");
    } catch {}
    clearCart();
    navigate("/my-orders");
  };

  useEffect(() => {
    if (isAuthenticated && role === "CUSTOMER") {
      const raw = localStorage.getItem("cart_items");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const toSync = parsed.map((i) => ({ product: i.product.id, quantity: i.quantity }));
          api.post("cart/sync/", { items: toSync }).then(() => {
            localStorage.removeItem("cart_items");
          });
        } catch {}
      }
    }
  }, [isAuthenticated, role]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
