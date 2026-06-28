/**
 * Centralised API service layer.
 * Every network call in the app goes through this file — no component or
 * context should call `fetch` directly. Keeping it in one place avoids
 * duplicated request logic and makes the base URL easy to change.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Thin fetch wrapper that throws a readable Error for non-2xx responses
 * so callers can catch it and show a Toast.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return body.data;
}

/* ---------------------------- Products ---------------------------- */

/** Fetch all products. Optionally pass { category } to filter server-side. */
export function fetchProducts({ category } = {}) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/products${query}`);
}

/** Fetch the distinct list of product categories. */
export function fetchCategories() {
  return request("/products/categories");
}

/** Search products by free-text query. */
export function searchProducts(q) {
  return request(`/products/search?q=${encodeURIComponent(q)}`);
}

/** Fetch a single product by id. */
export function fetchProductById(id) {
  return request(`/products/${id}`);
}

/** Create a new product (generic — used by admin-style flows). */
export function createProduct(data) {
  return request("/products", { method: "POST", body: JSON.stringify(data) });
}

/** Update an existing product. */
export function updateProduct(id, data) {
  return request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

/** Delete a product. */
export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}

/** Fetch dashboard summary stats (total products, orders, revenue). */
export function fetchStats() {
  return request("/stats");
}

/* ------------------------------ Cart ------------------------------- */

/** Fetch the current cart contents. */
export function fetchCart() {
  return request("/cart");
}

/** Add an item to the cart. */
export function addCartItem(item) {
  return request("/cart", { method: "POST", body: JSON.stringify(item) });
}

/** Update the quantity of a cart item (id = productId). */
export function updateCartItem(productId, quantity) {
  return request(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) });
}

/** Remove an item from the cart (id = productId). */
export function removeCartItem(productId) {
  return request(`/cart/${productId}`, { method: "DELETE" });
}

/* ---------------------------- Crafters ----------------------------- */

/** Fetch products belonging to the logged-in crafter. */
export function fetchCrafterProducts() {
  return request("/crafters/products");
}

/** Crafter uploads a new product. */
export function uploadCrafterProduct(data) {
  return request("/crafters/products", { method: "POST", body: JSON.stringify(data) });
}

/* ------------------------------ Auth -------------------------------- */

/** Dummy login — picks a role and returns a demo profile + token. */
export function login(role) {
  return request("/login", { method: "POST", body: JSON.stringify({ role }) });
}

/** Fetch the dummy profile for a role. */
export function fetchProfile(role) {
  return request(`/profile?role=${encodeURIComponent(role)}`);
}
