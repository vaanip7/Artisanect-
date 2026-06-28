import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

/**
 * ProductCard
 * Catalog-style product card showing image, title, artisan, star rating,
 * price, a wishlist toggle, and quick "Add to Cart" / "View Details"
 * actions. Used across the Home catalog, Shop, Wishlist, and related
 * products sections.
 *
 * @param {Object} props
 * @param {Object} props.product - Product object (id, title, artisanName, price, rating, image, category).
 * @returns {JSX.Element}
 */
function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative bg-white dark:bg-ink-light rounded-xl border border-ink/10 dark:border-paper/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Wishlist toggle */}
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-paper/90 dark:bg-ink/90 flex items-center justify-center shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${wishlisted ? "fill-clay text-clay" : "fill-none text-ink/50 dark:text-paper/60"}`}
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7.5-4.6-10-9.1C.5 8.5 2.3 5 5.8 5c1.9 0 3.4 1 4.2 2.4C10.8 6 12.3 5 14.2 5c3.5 0 5.3 3.5 3.8 6.9C19.5 16.4 12 21 12 21Z" />
        </svg>
      </button>

      <Link to={`/product/${product.id}`} className="h-44 sm:h-48 w-full overflow-hidden bg-ink/5 dark:bg-paper/5 block">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-clay font-semibold">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-base text-ink dark:text-paper hover:text-clay transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-ink/55 dark:text-paper/55">by {product.artisanName}</p>

        <div className="flex items-center gap-1 mt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-gold" : "fill-ink/15 dark:fill-paper/15"}`}
            >
              <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6Z" />
            </svg>
          ))}
          <span className="text-[11px] text-ink/45 dark:text-paper/45 ml-1">{product.rating?.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-display font-bold text-lg text-ink dark:text-paper">₹{product.price}</span>
          <button
            type="button"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-clay hover:bg-clay-dark disabled:opacity-40 disabled:cursor-not-allowed text-paper text-xs font-semibold px-3.5 py-2 rounded-md transition-colors"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
