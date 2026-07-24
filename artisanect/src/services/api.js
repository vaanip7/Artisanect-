/**
 * api.js — centralised HTTP client for the Artisanect frontend
 *
 * All requests go through `request()` so we have one place to:
 *  - attach the base URL
 *  - inject the JWT Authorization header for authenticated routes
 *  - normalise the response into { success, data } | { success, message }
 *  - surface backend errors as thrown Error objects (so callers can catch them)
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Token helpers ────────────────────────────────────────────────────────────

const TOKEN_KEY = "artisanect_token";

export function getToken()          { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t)         { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken()        { localStorage.removeItem(TOKEN_KEY); }

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Core request helper ──────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return json;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Login with real credentials. Returns { user, token }.
 *
 * @param {string} email
 * @param {string} password
 */
export async function loginWithCredentials(email, password) {
  const json = await request("/auth/login", {
    method: "POST",
    body:   JSON.stringify({ email, password }),
  });
  return json.data; // { user, token }
}

/**
 * Register a new account.
 *
 * @param {{ name, email, password, role, craft? }} data
 */
export async function registerUser(data) {
  const json = await request("/auth/register", {
    method: "POST",
    body:   JSON.stringify(data),
  });
  return json.data; // { user, token }
}

/**
 * Fetch the current user's profile (requires a valid JWT in localStorage).
 */
export async function fetchCurrentUser() {
  const json = await request("/auth/me");
  return json.data.user;
}

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * @param {{ category?: string, featured?: boolean }} params
 */
export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.featured) qs.set("featured", "true");
  const json = await request(`/products${qs.toString() ? "?" + qs : ""}`);
  return json.data;
}

export async function fetchCategories() {
  const json = await request("/products/categories");
  return json.data;
}

export async function fetchProductById(id) {
  const json = await request(`/products/${id}`);
  return json.data;
}

export async function searchProducts(query) {
  const json = await request(`/products/search?q=${encodeURIComponent(query)}`);
  return json.data;
}

export async function createProduct(data) {
  const json = await request("/products", {
    method: "POST",
    body:   JSON.stringify(data),
  });
  return json.data;
}

export async function updateProductById(id, data) {
  const json = await request(`/products/${id}`, {
    method: "PUT",
    body:   JSON.stringify(data),
  });
  return json.data;
}

export async function deleteProductById(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}

// ─── Cart (auth required) ─────────────────────────────────────────────────────

export async function fetchCart() {
  const json = await request("/cart");
  return json.data;
}

export async function addToCart(productId, quantity = 1) {
  const json = await request("/cart", {
    method: "POST",
    body:   JSON.stringify({ productId, quantity }),
  });
  return json.data;
}

export async function updateCartItem(productId, quantity) {
  const json = await request(`/cart/${productId}`, {
    method: "PUT",
    body:   JSON.stringify({ quantity }),
  });
  return json.data;
}

export async function removeFromCart(productId) {
  return request(`/cart/${productId}`, { method: "DELETE" });
}

export async function clearCart() {
  return request("/cart/clear", { method: "DELETE" });
}

// ─── Crafter (auth + CRAFTER role required) ───────────────────────────────────

export async function fetchCrafterProducts() {
  const json = await request("/crafters/products");
  return json.data;
}

export async function uploadProduct(data) {
  const json = await request("/crafters/products", {
    method: "POST",
    body:   JSON.stringify(data),
  });
  return json.data;
}

export async function fetchCrafterOrders() {
  const json = await request("/crafters/orders");
  return json.data;
}

export async function fetchCrafterStats() {
  const json = await request("/crafters/stats");
  return json.data;
}

/**
 * Legacy: kept so any code that still calls loginAs(role) gets a
 * clear runtime message rather than a silent crash.
 * @deprecated Use loginWithCredentials(email, password) instead.
 */
export function loginAs() {
  console.warn("[api] loginAs() is deprecated. Use loginWithCredentials(email, password).");
  return Promise.reject(new Error("Use loginWithCredentials(email, password) instead."));
}

// ─── AI (Gemini-powered) ───────────────────────────────────────────────────────

/**
 * Generate a professional title, description, and selling highlights for a
 * product listing from a few structured inputs.
 * Requires an authenticated crafter (same auth header handling as everything
 * else in this file — see `authHeaders()`).
 *
 * @param {{ name: string, category: string, material: string, price: string|number, tags?: string }} input
 * @returns {Promise<{ title: string, description: string, highlights: string[] }>}
 */
export async function generateProductDescription(input) {
  const json = await request("/ai/generate-description", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return json.data;
}

/**
 * Send a message to the ArtisanAI chat assistant.
 *
 * @param {string} message - the new message from the user
 * @param {{role: "user"|"assistant", content: string}[]} [history] - prior turns in this session
 * @returns {Promise<string>} the assistant's reply
 */
export async function sendAIChatMessage(message, history = []) {
  const json = await request("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
  return json.data.reply;
}

/**
 * Natural-language product search — e.g. "gift under 500", "eco friendly decor".
 * The backend uses Gemini to extract keywords/price intent, then queries the
 * same product database as the regular keyword search.
 *
 * @param {string} query
 * @returns {Promise<Array>} matching products, same shape as fetchProducts()/searchProducts()
 */
export async function aiSearchProducts(query) {
  const json = await request("/ai/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return json.data;
}
