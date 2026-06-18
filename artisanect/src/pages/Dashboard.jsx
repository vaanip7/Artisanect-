import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const stats = [
  {
    label: "Total Products",
    value: "24",
    helper: "Listed across 4 categories",
    icon: "M3 7l1.5-3h15L21 7M3 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7M3 7h18M8 11h8",
  },
  {
    label: "Total Orders",
    value: "138",
    helper: "12 pending fulfillment",
    icon: "M9 2l1 4h4l1-4M5 6h14l-1.5 13.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 6Z",
  },
  {
    label: "Revenue",
    value: "₹56,400",
    helper: "This month, up 18%",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
];

function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay">
            Seller Overview
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-2 mb-10">
            Artisan Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-clay/10 flex items-center justify-center text-clay">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <p className="text-sm font-medium text-ink/60">{stat.label}</p>
                <p className="font-display font-bold text-3xl text-ink">{stat.value}</p>
                <p className="text-xs text-ink/50">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-2 border-dashed border-ink/15 rounded-xl p-10 text-center text-ink/50 text-sm">
            Recent orders and product analytics will appear here.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
