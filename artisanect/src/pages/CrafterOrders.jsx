import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showErrorToast } from "../components/ui/index.js";
import { fetchCrafterOrders } from "../services/api.js";

const statusColors = {
  Pending:    "bg-ink/10 text-ink/60 dark:bg-paper/10 dark:text-paper/60",
  Processing: "bg-clay/15 text-clay",
  Shipped:    "bg-gold/15 text-gold-dark dark:text-gold",
  Delivered:  "bg-green-500/15 text-green-600 dark:text-green-400",
};

function CrafterOrders() {
  const [orders, setOrders]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCrafterOrders()
      .then(setOrders)
      .catch(() => showErrorToast("Could not load orders."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-2">Orders Received</h1>
          <p className="text-sm text-ink/55 dark:text-paper/55 mb-10">Order data is linked to your actual catalog products.</p>

          {isLoading && <div className="flex justify-center py-12"><Loader size="lg" label="Loading orders…"/></div>}

          {!isLoading && orders.length === 0 && (
            <p className="text-center text-ink/50 dark:text-paper/50 py-12">No orders yet. List some products to start receiving orders!</p>
          )}

          {!isLoading && orders.length > 0 && (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <div key={order.id} className="flex flex-wrap items-center gap-4 bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-4">
                  <span className="font-display font-semibold text-sm text-ink dark:text-paper w-28">{order.id}</span>
                  <span className="text-sm text-ink/70 dark:text-paper/70 flex-1 min-w-[140px]">{order.product}</span>
                  <span className="text-sm text-ink/60 dark:text-paper/60 w-32">{order.customer}</span>
                  <span className="text-sm text-ink/60 dark:text-paper/60 w-16">Qty {order.quantity}</span>
                  <span className="text-sm font-medium text-ink dark:text-paper w-24">₹{order.total?.toLocaleString("en-IN")}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || statusColors.Pending}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CrafterOrders;
