import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Loader, Button, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { fetchProductById, fetchProducts } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { addRecentlyViewed } from "../utils/recentlyViewed.js";

/**
 * StarRating
 * Small presentational row of 5 stars filled up to the given rating,
 * plus the numeric value. Shared by the gallery header and review line.
 *
 * @param {{ rating: number }} props
 * @returns {JSX.Element}
 */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < Math.round(rating) ? "fill-gold" : "fill-ink/15 dark:fill-paper/15"}`}
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * StockBadge
 * Colour-coded availability indicator derived from the product's stock
 * count — out of stock, low stock, or comfortably in stock.
 *
 * @param {{ stock: number }} props
 * @returns {JSX.Element}
 */
function StockBadge({ stock }) {
  if (!stock) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        Out of stock
      </span>
    );
  }
  if (stock <= 8) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark dark:text-gold bg-gold/10 rounded-full px-3 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-500/10 rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
      In stock
    </span>
  );
}

/**
 * ProductDetails
 * Full detail view for a single product: an image gallery, artisan and
 * category info, rating and stock, a complete spec sheet (materials,
 * dimensions, delivery estimate), a quantity selector, Add to Cart / Buy
 * Now / Wishlist / Share actions, and a row of related products from the
 * same category.
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
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");
    setQuantity(1);
    setActiveImage(0);

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
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const materials = product.materials || [];

  async function handleShare() {
    const shareData = {
      title: product.title,
      text: `Check out ${product.title} on Artisanect`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccessToast("Product link copied to clipboard");
      }
    } catch (err) {
      // AbortError happens when the user cancels the native share sheet —
      // that's not really a failure, so we stay quiet about it.
      if (err && err.name !== "AbortError") {
        showErrorToast("Couldn't share this product");
      }
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-ink/50 dark:text-paper/50 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/shop" className="hover:text-clay transition-colors">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-clay transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-ink/70 dark:text-paper/70">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 mb-16">
            {/* ---- Gallery ---- */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-ink/5 dark:bg-paper/5 h-80 sm:h-[28rem]">
                <img
                  src={gallery[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {gallery.length > 1 && (
                <div className="flex items-center gap-3 mt-4">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                        i === activeImage ? "border-clay" : "border-transparent hover:border-ink/20 dark:hover:border-paper/20"
                      }`}
                    >
                      <img src={src} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---- Info ---- */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                  {product.category}
                </span>
                <StockBadge stock={product.stock} />
              </div>

              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper leading-snug">
                  {product.title}
                </h1>
                <p className="text-sm text-ink/60 dark:text-paper/60 mt-1.5">
                  by <span className="font-medium text-ink/80 dark:text-paper/80">{product.artisanName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-xs text-ink/50 dark:text-paper/50">
                  {product.rating?.toFixed(1)} rating
                </span>
              </div>

              <p className="font-display font-bold text-3xl text-ink dark:text-paper">₹{product.price}</p>

              <p className="text-sm text-ink/70 dark:text-paper/70 leading-relaxed">{product.description}</p>

              <div className="h-px stitch-divider"></div>

              {/* Spec sheet: materials, dimensions, delivery */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {materials.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-ink/45 dark:text-paper/45 uppercase text-[11px] tracking-wide font-semibold mb-1.5">
                      Materials used
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {materials.map((m) => (
                        <span
                          key={m}
                          className="text-xs text-ink/70 dark:text-paper/70 bg-ink/5 dark:bg-paper/10 rounded-full px-3 py-1"
                        >
                          {m}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <dt className="text-ink/45 dark:text-paper/45 uppercase text-[11px] tracking-wide font-semibold mb-1">
                      Dimensions
                    </dt>
                    <dd className="text-ink/75 dark:text-paper/75">{product.dimensions}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-ink/45 dark:text-paper/45 uppercase text-[11px] tracking-wide font-semibold mb-1 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7Zm11 3h3.5l2.5 3v2h-6v-5ZM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                    </svg>
                    Estimated delivery
                  </dt>
                  <dd className="text-ink/75 dark:text-paper/75">
                    {product.deliveryEstimate || "5-7 business days"}
                  </dd>
                </div>
              </dl>

              <div className="h-px stitch-divider"></div>

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

              <div className="flex flex-wrap items-center gap-3 mt-1">
                <Button variant="primary" onClick={() => addItem(product, quantity)} disabled={product.stock === 0}>
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    addItem(product, quantity);
                    navigate("/cart");
                  }}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-md border transition-colors ${
                    wishlisted
                      ? "border-clay text-clay"
                      : "border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-clay"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 ${wishlisted ? "fill-clay" : "fill-none"}`} stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.6-10-9.1C.5 8.5 2.3 5 5.8 5c1.9 0 3.4 1 4.2 2.4C10.8 6 12.3 5 14.2 5c3.5 0 5.3 3.5 3.8 6.9C19.5 16.4 12 21 12 21Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  title="Share this product"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-clay transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7 15.3 7M8.7 13.3l6.6 3.7M18 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div>
              <div className="h-px stitch-divider mb-10"></div>
              <h2 className="font-display font-semibold text-lg sm:text-xl text-ink dark:text-paper mb-1">
                Related Products
              </h2>
              <p className="text-sm text-ink/55 dark:text-paper/55 mb-6">
                More from the {product.category} collection
              </p>
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
