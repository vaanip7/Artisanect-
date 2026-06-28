import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Loader, Button } from "../components/ui/index.js";
import { fetchProductById, fetchProducts } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { addRecentlyViewed } from "../utils/recentlyViewed.js";

/**
 * ProductDetails
 * Full detail view for a single product: image, artisan info,
 * description, price, rating, a quantity selector, Add to Cart / Buy
 * Now / Wishlist actions, and a row of related products from the same
 * category.
 *
 * @returns {JSX.Element}
 */
function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");
    setQuantity(1);

    fetchProductById(productId)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        addRecentlyViewed(data.id);
        return fetchProducts({ category: data.category });
      })
      .then((sameCategory) => {
        if (!isMounted || !sameCategory) return;
        setRelated(sameCategory.filter((p) => p.id !== productId).slice(0, 3));
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex justify-center py-24 bg-paper dark:bg-ink">
          <Loader size="lg" label="Loading product..." />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center gap-4 py-24 bg-paper dark:bg-ink text-center px-5">
          <p className="text-ink/60 dark:text-paper/60">
            Couldn&apos;t load this product. It may not exist, or the backend isn&apos;t running.
          </p>
          <Link to="/shop" className="text-clay font-medium hover:underline">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="rounded-xl overflow-hidden bg-ink/5 dark:bg-paper/5 h-72 sm:h-96">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                {product.category}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper">
                {product.title}
              </h1>
              <p className="text-sm text-ink/60 dark:text-paper/60">by {product.artisanName}</p>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold" : "fill-ink/15 dark:fill-paper/15"}`}
                  >
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6Z" />
                  </svg>
                ))}
                <span className="text-xs text-ink/50 dark:text-paper/50 ml-1">
                  {product.rating?.toFixed(1)} &middot; {product.stock} in stock
                </span>
              </div>

              <p className="text-sm text-ink/70 dark:text-paper/70 leading-relaxed">{product.description}</p>

              <p className="font-display font-bold text-3xl text-ink dark:text-paper">₹{product.price}</p>

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink/60 dark:text-paper/60">Quantity</span>
                <div className="flex items-center border border-ink/15 dark:border-paper/20 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-ink dark:text-paper"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm text-ink dark:text-paper">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-ink dark:text-paper"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Button variant="primary" onClick={() => addItem(product, quantity)} disabled={product.stock === 0}>
                  Add to Cart
                </Button>
                <Button variant="secondary" onClick={() => { addItem(product, quantity); navigate("/cart"); }} disabled={product.stock === 0}>
                  Buy Now
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-md border transition-colors ${
                    wishlisted
                      ? "border-clay text-clay"
                      : "border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-clay"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 ${wishlisted ? "fill-clay" : "fill-none"}`} stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.6-10-9.1C.5 8.5 2.3 5 5.8 5c1.9 0 3.4 1 4.2 2.4C10.8 6 12.3 5 14.2 5c3.5 0 5.3 3.5 3.8 6.9C19.5 16.4 12 21 12 21Z" />
                  </svg>
                  Wishlist
                </button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetails;
