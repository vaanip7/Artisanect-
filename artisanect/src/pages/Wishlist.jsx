import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Loader, showErrorToast } from "../components/ui/index.js";
import { fetchProducts } from "../services/api.js";
import { useWishlist } from "../context/WishlistContext.jsx";

/**
 * Wishlist
 * Shows every product the customer has wishlisted, sourced from the
 * live product catalog filtered against the saved wishlist ids.
 *
 * @returns {JSX.Element}
 */
function Wishlist() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProducts()
      .then((data) => {
        if (isMounted) setProducts(data.filter((p) => ids.includes(p.id)));
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          showErrorToast("Could not load wishlist. Is the backend running?");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [ids]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-10">
            Your Wishlist
          </h1>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader size="lg" label="Loading wishlist..." />
            </div>
          )}

          {!isLoading && error && (
            <p className="text-center text-sm text-red-500">Couldn&apos;t load your wishlist right now.</p>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-ink/60 dark:text-paper/60 mb-4">Your wishlist is empty.</p>
              <Link to="/shop" className="text-clay font-medium hover:underline">
                Browse the Shop
              </Link>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Wishlist;
