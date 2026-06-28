import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

/**
 * CrafterOrders
 * "Orders Received" view for crafters. Backed by static dummy data for
 * now — a real orders backend is planned for a later week once
 * checkout/payments exist.
 *
 * @returns {JSX.Element}
 */
const dummyOrders = [
  { id: "ORD-1042", product: "Wooden Wall Art", customer: "Asha Mehta", quantity: 1, status: "Shipped", date: "2026-06-21" },
  { id: "ORD-1041", product: "Madhubani Painting", customer: "Rohit Singh", quantity: 2, status: "Processing", date: "2026-06-20" },
  { id: "ORD-1039", product: "Wooden Handicraft", customer: "Neha Kapoor", quantity: 1, status: "Delivered", date: "2026-06-17" },
];

const statusColors = {
  Shipped: "bg-gold/15 text-gold-dark dark:text-gold",
  Processing: "bg-clay/15 text-clay",
  Delivered: "bg-green-500/15 text-green-600 dark:text-green-400",
};

function CrafterOrders() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-2">
            Orders Received
          </h1>
          <p className="text-sm text-ink/55 dark:text-paper/55 mb-10">
            Demo data — real order tracking arrives once checkout is connected to a database.
          </p>

          <div className="flex flex-col gap-3">
            {dummyOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center gap-4 bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-4"
              >
                <span className="font-display font-semibold text-sm text-ink dark:text-paper w-24">{order.id}</span>
                <span className="text-sm text-ink/70 dark:text-paper/70 flex-1 min-w-[140px]">{order.product}</span>
                <span className="text-sm text-ink/60 dark:text-paper/60 w-32">{order.customer}</span>
                <span className="text-sm text-ink/60 dark:text-paper/60 w-16">Qty {order.quantity}</span>
                <span className="text-xs text-ink/45 dark:text-paper/45 w-24">{order.date}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CrafterOrders;
