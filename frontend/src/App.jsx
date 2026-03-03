import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Public
import Home from "./pages/public/Home";
import Login from "./pages/Login";
import Signup from "./pages/public/Signup";
import Products from "./pages/public/Products";

// Customer
import Subscriptions from "./pages/customer/Subscriptions";
import Profile from "./pages/customer/Profile";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminStaff from "./pages/admin/Staff";
import StaffProfile from "./pages/staff/Profile";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />

          {/* Customer */}
          <Route path="/cart" element={<Navigate to="/subscriptions" replace />} />
          <Route path="/checkout" element={<Navigate to="/subscriptions" replace />} />
          <Route path="/my-orders" element={<Navigate to="/subscriptions" replace />} />
          <Route path="/orders" element={<Navigate to="/subscriptions" replace />} />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <Subscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/orders" element={<Navigate to="/admin/subscriptions" replace />} />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminSubscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute allowedRole="STAFF">
                <StaffProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/staff" element={<Navigate to="/staff/profile" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
