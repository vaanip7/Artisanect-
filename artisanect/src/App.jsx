import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing               from "./pages/Landing.jsx";
import About                 from "./pages/About.jsx";
import Login                 from "./pages/Login.jsx";
import Register              from "./pages/Register.jsx";
import AuthCallback          from "./pages/AuthCallback.jsx";
import Shop                  from "./pages/Shop.jsx";
import ProductDetails        from "./pages/ProductDetails.jsx";
import Cart                  from "./pages/Cart.jsx";
import Wishlist              from "./pages/Wishlist.jsx";
import Profile               from "./pages/Profile.jsx";
import Dashboard             from "./pages/Dashboard.jsx";
import CrafterUploadProduct  from "./pages/CrafterUploadProduct.jsx";
import CrafterMyProducts     from "./pages/CrafterMyProducts.jsx";
import CrafterOrders         from "./pages/CrafterOrders.jsx";
import ComponentsDemo        from "./pages/ComponentsDemo.jsx";

import ProtectedRoute        from "./components/ProtectedRoute.jsx";

import { ThemeProvider }     from "./context/ThemeContext.jsx";
import { AuthProvider }      from "./context/AuthContext.jsx";
import { CartProvider }      from "./context/CartContext.jsx";
import { WishlistProvider }  from "./context/WishlistContext.jsx";
import { ToastContainer }    from "./components/ui/index.js";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-paper text-ink dark:bg-ink dark:text-paper font-body transition-colors duration-300">
              <Routes>
                {/* ── Public ───────────────────────────────────────────────── */}
                <Route path="/"               element={<Landing />} />
                <Route path="/about"          element={<About />} />
                <Route path="/login"          element={<Login />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/auth/callback"  element={<AuthCallback />} />
                <Route path="/shop"           element={<Shop />} />
                <Route path="/product/:id"    element={<ProductDetails />} />
                <Route path="/components-demo" element={<ComponentsDemo />} />

                {/* ── Requires any authenticated user ──────────────────────── */}
                <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* ── Crafter only ─────────────────────────────────────────── */}
                <Route path="/dashboard"        element={<ProtectedRoute role="crafter"><Dashboard /></ProtectedRoute>} />
                <Route path="/crafter/upload"   element={<ProtectedRoute role="crafter"><CrafterUploadProduct /></ProtectedRoute>} />
                <Route path="/crafter/products" element={<ProtectedRoute role="crafter"><CrafterMyProducts /></ProtectedRoute>} />
                <Route path="/crafter/orders"   element={<ProtectedRoute role="crafter"><CrafterOrders /></ProtectedRoute>} />
              </Routes>
              <ToastContainer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
