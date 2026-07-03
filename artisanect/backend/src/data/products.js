import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_FILE = path.join(__dirname, "products.json");

/**
 * In-memory product data store.
 *
 * Week 4 requires the catalog to live in memory (no real database yet), but
 * that doesn't mean the seed data has to be buried inside a JS file. On
 * startup we read the catalog once from `products.json` — a plain, easy to
 * open/edit data file — and parse it into this in-memory array. From then on
 * every read and write (create/update/delete) happens purely in memory,
 * exactly like the original Week 4 implementation; nothing is ever written
 * back to the JSON file, so a server restart resets the catalog to the
 * seed data again, same as before.
 */
let products = JSON.parse(readFileSync(SEED_FILE, "utf-8"));

let nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;

export function getAllProducts() {
  return products;
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))].sort();
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function getProductsByCrafter(crafterId) {
  return products.filter((p) => p.crafterId === crafterId);
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.artisanName.toLowerCase().includes(q)
  );
}

export function createProduct(data) {
  const product = {
    id: nextId++,
    rating: 0,
    stock: 0,
    featured: false,
    tags: [],
    materials: [],
    dimensions: "",
    deliveryEstimate: "5-7 business days",
    images: [],
    crafterId: "demo-crafter",
    ...data,
  };
  if (!product.images || product.images.length === 0) {
    product.images = product.image ? [product.image] : [];
  }
  products.push(product);
  return product;
}

export function updateProduct(id, data) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data, id };
  return products[index];
}

export function deleteProduct(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

export function getStats() {
  return {
    totalProducts: products.length,
    totalOrders: 138,
    revenue: 56400,
  };
}
