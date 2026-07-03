import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showErrorToast } from "../components/ui/index.js";
import { fetchCrafterStats } from "../services/api.js";

const statMeta = [
  {
    key: "totalProducts",
    label: "Total Products",
    helper: "Live count from the catalog",
    icon: "M3 7l1.5-3h15L21 7M3 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7M3 7h18M8 11h8",
    format: (v) => String(v),
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    helper: "12 pending fulfillment",
    icon: "M9 2l1 4h4l1-4M5 6h14l-1.5 13.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 6Z",
    format: (v) => String(v),
  },
  {
    key: "revenue",
    label: "Revenue",
    helper: "This month, up 18%",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    format: (v) => `\u20B9${Number(v).toLocaleString("en-IN")}`,
  },
];

const quickLinks = [
  { to: "/crafter/upload", label: "Upload Product" },
  { to: "/crafter/products", label: "My Products" },
  { to: "/crafter/orders", label: "Orders Received" },
];

// Dummy analytics — a real analytics pipeline is a future-week feature.
const dummyAnalytics = [
  { label: "Profile Views (7d)", value: "342" },
  { label: "Most Popular Product", value: "Wooden Wall Art" },
  { label: "Conversion Rate", value: "4.2%" },
];

/**
 * Dashboard
 * Crafter's overview hub: live stat cards from `/api/stats`, quick
 * links to the upload/manage/orders pages, and a dummy analytics
 * panel (real analytics is a future-week feature).
 *
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchCrafterStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          showErrorToast("Could not load dashboard stats. Is the backend running?");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                Seller Overview
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mt-2">
                Crafter Dashboard
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-semibold px-4 py-2 rounded-md border border-ink/15 dark:border-paper/20 text-ink dark:text-paper hover:border-clay hover:text-clay transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader size="lg" label="Loading dashboard stats..." />
            </div>
          )}

          {!isLoading && error && (
            <p className="text-center text-sm text-red-500">
              Couldn&apos;t load dashboard stats right now. Please make sure the backend server is running.
            </p>
          )}

          {!isLoading && !error && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {statMeta.map((meta) => (
                <div
                  key={meta.key}
                  className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-6 flex flex-col gap-3 shadow-sm transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-clay/10 dark:bg-clay/20 flex items-center justify-center text-clay">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-ink/60 dark:text-paper/60">{meta.label}</p>
                  <p className="font-display font-bold text-3xl text-ink dark:text-paper">
                    {meta.format(stats[meta.key])}
                  </p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">{meta.helper}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-ink/15 dark:border-paper/20 rounded-xl p-6">
            <h2 className="font-display font-semibold text-ink dark:text-paper mb-4">
              Product Analytics <span className="text-xs text-ink/40 dark:text-paper/40">(dummy data)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dummyAnalytics.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-display font-bold text-xl text-ink dark:text-paper">{item.value}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
