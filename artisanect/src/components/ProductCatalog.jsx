import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { Loader, Input, showErrorToast } from "./ui/index.js";
import { fetchProducts, fetchCategories, searchProducts, aiSearchProducts } from "../services/api.js";

/**
 * ProductCatalog
 * Reusable search + category-filter + responsive grid of products,
 * backed by live API calls (debounced search, server-side category
 * filtering). Used by both the Home page (curated/featured view) and
 * the full Shop page.
 *
 * Includes an "AI Search" toggle: when enabled, the search box accepts
 * natural-language queries like "gift under 500" or "eco friendly decor",
 * which are sent to Gemini via /api/ai/search to be translated into
 * keywords (and an optional price ceiling) before querying the same
 * product database as the regular keyword search.
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
  const [aiSearchEnabled, setAiSearchEnabled] = useState(false);
  const [aiSearchNote, setAiSearchNote] = useState("");

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
    setAiSearchNote("");

    const term = searchTerm.trim();
   // AI search hits Gemini's free-tier quota (as low as 5 requests/minute
// on some models), so debounce it more aggressively than the plain
// keyword search, which only costs a local DB query.
const delay = term ? (aiSearchEnabled ? 900 : 350) : 0;
    const handle = setTimeout(() => {
      let loader;
      if (term && aiSearchEnabled) {
        loader = aiSearchProducts(term).then((data) => {
          if (isMounted && data?.length === 0) {
            setAiSearchNote(`No matches for "${term}" — try rephrasing your search.`);
          }
          return data;
        });
      } else if (term) {
        loader = searchProducts(term);
      } else {
        loader = fetchProducts(activeCategory !== "All" ? { category: activeCategory } : {});
      }

      loader
        .then((data) => {
          if (isMounted) setProducts(data);
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            showErrorToast(
              aiSearchEnabled && term
                ? "AI search failed. Try again or switch to regular search."
                : "Could not load products. Is the backend running?"
            );
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
  }, [searchTerm, activeCategory, aiSearchEnabled]);

  const isDefaultView = defaultFeaturedOnly && !searchTerm.trim() && activeCategory === "All";
  const displayed = isDefaultView ? products.filter((p) => p.featured) : products;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-3">
        <div className="sm:w-72">
          <Input
            placeholder={
              aiSearchEnabled
                ? 'Try "gift under 500" or "eco friendly decor"...'
                : "Search handcrafted products..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => setAiSearchEnabled((prev) => !prev)}
          aria-pressed={aiSearchEnabled}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors w-fit ${
            aiSearchEnabled
              ? "bg-gold text-ink border-gold"
              : "border-ink/15 dark:border-paper/20 text-ink/70 dark:text-paper/70 hover:border-gold"
          }`}
        >
          ✨ AI Search {aiSearchEnabled ? "On" : "Off"}
        </button>

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

      {aiSearchEnabled && (
        <p className="text-xs text-ink/50 dark:text-paper/50 mb-4">
          AI Search is on — describe what you're looking for in natural language.
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" label={aiSearchEnabled && searchTerm.trim() ? "Thinking..." : "Loading products..."} />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-sm text-red-500 py-8">
          Couldn&apos;t load products right now. Please make sure the backend server is running.
        </p>
      )}

      {!isLoading && !error && aiSearchNote && (
        <p className="text-center text-sm text-ink/50 dark:text-paper/50 py-2">{aiSearchNote}</p>
      )}

      {!isLoading && !error && displayed.length === 0 && !aiSearchNote && (
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
