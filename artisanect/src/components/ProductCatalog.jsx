import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { Loader, Input, showErrorToast } from "./ui/index.js";
import { fetchProducts, fetchCategories, searchProducts } from "../services/api.js";

/**
 * ProductCatalog
 * Reusable search + category-filter + responsive grid of products,
 * backed by live API calls (debounced search, server-side category
 * filtering). Used by both the Home page (curated/featured view) and
 * the full Shop page.
 *
 * @param {Object} props
 * @param {boolean} [props.defaultFeaturedOnly=false] - When true and no search/filter is active, shows only featured products.
 * @returns {JSX.Element}
 */
function ProductCatalog({ defaultFeaturedOnly = false }) {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        /* category pills are a nice-to-have; fail quietly */
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError("");

    const delay = searchTerm.trim() ? 350 : 0;
    const handle = setTimeout(() => {
      const loader = searchTerm.trim()
        ? searchProducts(searchTerm.trim())
        : fetchProducts(activeCategory !== "All" ? { category: activeCategory } : {});

      loader
        .then((data) => {
          if (isMounted) setProducts(data);
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            showErrorToast("Could not load products. Is the backend running?");
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(handle);
    };
  }, [searchTerm, activeCategory]);

  const isDefaultView = defaultFeaturedOnly && !searchTerm.trim() && activeCategory === "All";
  const displayed = isDefaultView ? products.filter((p) => p.featured) : products;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <div className="sm:w-72">
          <Input
            placeholder="Search handcrafted products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              activeCategory === "All"
                ? "bg-clay text-paper border-clay"
                : "border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-clay"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-clay text-paper border-clay"
                  : "border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-clay"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" label="Loading products..." />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-sm text-red-500 py-8">
          Couldn&apos;t load products right now. Please make sure the backend server is running.
        </p>
      )}

      {!isLoading && !error && displayed.length === 0 && (
        <p className="text-center text-sm text-ink/50 dark:text-paper/50 py-12">
          No products match your search or filter.
        </p>
      )}

      {!isLoading && !error && displayed.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;
