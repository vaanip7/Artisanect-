/**
 * In-memory product data store.
 * Stands in for a real database — a persistent DB is planned for a later week.
 */
let products = [
  { id: 1, title: "Madhubani Painting", category: "Painting", artisanName: "Sita Devi", price: 1499, rating: 4.8, stock: 12, description: "Vibrant folk art from Bihar, hand-painted with natural dyes depicting nature, mythology, and everyday life.", image: "https://images.unsplash.com/photo-1582561833832-fc1c91d8cab1?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["folk-art", "painting", "bihar"], crafterId: "demo-artisan" },
  { id: 2, title: "Handwoven Basket", category: "Home Decor", artisanName: "Rukmini Bai", price: 899, rating: 4.6, stock: 20, description: "Sturdy, eco-friendly baskets hand-woven from natural fibers by skilled rural artisans.", image: "https://images.unsplash.com/photo-1622560481156-01af9b3f7df1?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["basket", "eco-friendly"], crafterId: "demo-artisan" },
  { id: 3, title: "Wooden Handicraft", category: "Wood Carving", artisanName: "Manoj Kumar", price: 1299, rating: 4.7, stock: 8, description: "Intricately carved wooden decor and figurines, showcasing generations of traditional craftsmanship.", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["wood", "carving"], crafterId: "demo-artisan" },
  { id: 4, title: "Block Print Dupatta", category: "Textile", artisanName: "Farida Begum", price: 749, rating: 4.5, stock: 25, description: "Hand block-printed cotton dupatta using traditional Bagru printing techniques from Rajasthan.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["textile", "block-print"], crafterId: "demo-artisan" },
  { id: 5, title: "Handmade Pottery", category: "Pottery", artisanName: "Ramesh Prajapati", price: 649, rating: 4.4, stock: 15, description: "Traditional clay pottery shaped on a hand-spun wheel and fired in a wood kiln.", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["pottery", "clay"], crafterId: "demo-artisan" },
  { id: 6, title: "Wooden Wall Art", category: "Wood Carving", artisanName: "Manoj Kumar", price: 1899, rating: 4.9, stock: 6, description: "Hand-carved decorative wall art panel made from reclaimed teak wood.", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["wood", "wall-art"], crafterId: "demo-artisan" },
  { id: 7, title: "Crochet Bag", category: "Textile", artisanName: "Lakshmi Nair", price: 999, rating: 4.6, stock: 18, description: "Hand-crocheted cotton tote bag, durable and lightweight for everyday use.", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["crochet", "bag"], crafterId: "demo-artisan" },
  { id: 8, title: "Handmade Candle", category: "Home Decor", artisanName: "Anjali Verma", price: 399, rating: 4.3, stock: 40, description: "Soy-wax candles hand-poured with essential oils in reusable ceramic jars.", image: "https://images.unsplash.com/photo-1602874801006-e26c4c0a2d76?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["candle", "home-decor"], crafterId: "demo-artisan" },
  { id: 9, title: "Resin Jewellery", category: "Jewellery", artisanName: "Priya Sharma", price: 549, rating: 4.5, stock: 30, description: "Handmade resin earrings embedded with dried flowers, one of a kind pieces.", image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["resin", "jewellery"], crafterId: "demo-artisan" },
  { id: 10, title: "Clay Mug", category: "Pottery", artisanName: "Ramesh Prajapati", price: 299, rating: 4.2, stock: 50, description: "Rustic hand-thrown clay mug with a matte glaze finish, microwave safe.", image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["pottery", "mug"], crafterId: "demo-artisan" },
  { id: 11, title: "Embroidered Cushion Cover", category: "Textile", artisanName: "Farida Begum", price: 649, rating: 4.6, stock: 22, description: "Hand-embroidered cushion cover featuring traditional phulkari needlework.", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["textile", "embroidery"], crafterId: "demo-artisan" },
  { id: 12, title: "Dream Catcher", category: "Home Decor", artisanName: "Anjali Verma", price: 449, rating: 4.4, stock: 35, description: "Hand-woven dream catcher with feathers and beads, made from natural fibers.", image: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["decor", "dreamcatcher"], crafterId: "demo-artisan" },
  { id: 13, title: "Macrame Wall Hanging", category: "Home Decor", artisanName: "Lakshmi Nair", price: 1099, rating: 4.7, stock: 10, description: "Intricately knotted macrame wall hanging woven from natural cotton cord.", image: "https://images.unsplash.com/photo-1622637935226-9c0a1c1c4f8c?auto=format&fit=crop&w=800&q=80", featured: true, tags: ["macrame", "wall-hanging"], crafterId: "demo-artisan" },
  { id: 14, title: "Hand-painted Bottle", category: "Painting", artisanName: "Sita Devi", price: 349, rating: 4.1, stock: 28, description: "Upcycled glass bottle hand-painted with traditional folk motifs.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["painting", "upcycled"], crafterId: "demo-artisan" },
  { id: 15, title: "Leather Wallet", category: "Leather", artisanName: "Imran Khan", price: 1199, rating: 4.8, stock: 14, description: "Hand-stitched genuine leather wallet, tanned and finished using traditional methods.", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["leather", "wallet"], crafterId: "demo-artisan" },
  { id: 16, title: "Handmade Soap", category: "Wellness", artisanName: "Anjali Verma", price: 249, rating: 4.5, stock: 60, description: "Cold-processed natural soap bars made with essential oils and herbal extracts.", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80", featured: false, tags: ["soap", "wellness"], crafterId: "demo-artisan" },
];

let nextId = products.length + 1;

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
    crafterId: "demo-crafter",
    ...data,
  };
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
