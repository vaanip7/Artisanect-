import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCatalog from "../components/ProductCatalog.jsx";

/**
 * Shop
 * Full product catalog page — every artisan product, searchable and
 * filterable by category. Customers reach this from the "Shop" nav link.
 *
 * @returns {JSX.Element}
 */
function Shop() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay">
            Full Catalog
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mt-2 mb-8">
            Shop All Products
          </h1>
          <ProductCatalog />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Shop;
