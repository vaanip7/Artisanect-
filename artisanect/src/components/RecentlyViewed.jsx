import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { fetchProductById } from "../services/api.js";
import { getRecentlyViewedIds } from "../utils/recentlyViewed.js";

/**
 * RecentlyViewed
 * Shows the products the visitor looked at most recently (tracked via
 * localStorage, no backend involved). Renders nothing if there's no
 * browsing history yet.
 *
 * @returns {JSX.Element|null}
 */
function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => fetchProductById(id).catch(() => null))).then((results) => {
      setProducts(results.filter(Boolean));
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
