import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Loader, showSuccessToast } from "../components/ui/index.js";
import { useCart } from "../context/CartContext.jsx";

/**
 * Cart
 * Shopping cart page: editable line items (quantity +/-, remove) and an
 * order summary panel with subtotal, a flat demo shipping fee, and a
 * total, plus a dummy "Place Order" action.
 *
 * @returns {JSX.Element}
 */
function Cart() {
  const { items, isLoading, removeItem, updateQuantity, total } = useCart();
  const shipping = items.length > 0 ? 49 : 0;

  function handlePlaceOrder() {
    showSuccessToast("Order placed! (demo — no payment was processed)");
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex justify-center py-24 bg-paper dark:bg-ink">
          <Loader size="lg" label="Loading cart..." />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-10">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink/60 dark:text-paper/60 mb-4">Your cart is empty.</p>
              <Link to="/shop" className="text-clay font-medium hover:underline">
                Browse the Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Line items */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-4"
                  >
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-ink dark:text-paper truncate">{item.title}</p>
                      <p className="text-sm text-ink/60 dark:text-paper/60">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center border border-ink/15 dark:border-paper/20 rounded-md">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink dark:text-paper"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm text-ink dark:text-paper">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink dark:text-paper"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-display font-semibold text-ink dark:text-paper w-20 text-right">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      className="text-ink/40 dark:text-paper/40 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-6 h-fit">
                <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm text-ink/70 dark:text-paper/70 mb-2">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-sm text-ink/70 dark:text-paper/70 mb-4">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-ink dark:text-paper text-lg border-t border-ink/10 dark:border-paper/10 pt-4 mb-6">
                  <span>Total</span>
                  <span>₹{total + shipping}</span>
                </div>
                <Button variant="primary" size="lg" onClick={handlePlaceOrder} disabled={items.length === 0}>
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
