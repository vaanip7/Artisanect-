import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import DevicePreview from "../components/DevicePreview.jsx";
import ProductCatalog from "../components/ProductCatalog.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";

/**
 * Home
 * Landing page: Navbar, Hero banner, a curated/featured product
 * catalog (search + category filter, backed by live API calls), a
 * "Recently Viewed" strip, and the Footer. Also mounts the
 * DevicePreview QA toggle for visually testing responsive breakpoints.
 *
 * @returns {JSX.Element}
 */
function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <Hero />

        <section id="products" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                Curated Crafts
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper mt-2">
                Featured Artisan Products
              </h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-clay hover:underline">
              View all products →
            </Link>
          </div>

          <ProductCatalog defaultFeaturedOnly />
          <RecentlyViewed />
        </section>
      </main>
      <Footer />
      <DevicePreview />
    </>
  );
}

export default Home;
