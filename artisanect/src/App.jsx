import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComponentsDemo from "./pages/ComponentsDemo.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Profile from "./pages/Profile.jsx";
import CrafterUploadProduct from "./pages/CrafterUploadProduct.jsx";
import CrafterMyProducts from "./pages/CrafterMyProducts.jsx";
import CrafterOrders from "./pages/CrafterOrders.jsx";
import RequireRole from "./components/RequireRole.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ToastContainer } from "./components/ui/index.js";

/**
 * App
 * Root application component. Wraps every route in the global
 * providers (theme, auth, cart, wishlist) and mounts the toast
 * notification container once at the top level so any page can
 * trigger toasts. Customer- and crafter-only routes are gated by
 * RequireRole.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-paper text-ink dark:bg-ink dark:text-paper font-body transition-colors duration-300">
              <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/components-demo" element={<ComponentsDemo />} />

                {/* Requires any logged-in role */}
                <Route path="/cart" element={<RequireRole><Cart /></RequireRole>} />
                <Route path="/wishlist" element={<RequireRole><Wishlist /></RequireRole>} />
                <Route path="/profile" element={<RequireRole><Profile /></RequireRole>} />

                {/* Crafter only */}
                <Route path="/dashboard" element={<RequireRole role="crafter"><Dashboard /></RequireRole>} />
                <Route path="/crafter/upload" element={<RequireRole role="crafter"><CrafterUploadProduct /></RequireRole>} />
                <Route path="/crafter/products" element={<RequireRole role="crafter"><CrafterMyProducts /></RequireRole>} />
                <Route path="/crafter/orders" element={<RequireRole role="crafter"><CrafterOrders /></RequireRole>} />
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
