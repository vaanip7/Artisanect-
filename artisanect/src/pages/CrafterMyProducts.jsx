import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Modal, Loader, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { fetchCrafterProducts, updateProductById, deleteProductById } from "../services/api.js";

/**
 * CrafterMyProducts
 * Lists every product uploaded by the logged-in crafter, with inline
 * Edit (via a Modal form) and Delete actions, plus a "Showcase Gallery"
 * strip of product thumbnails underneath.
 *
 * @returns {JSX.Element}
 */
function CrafterMyProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", stock: "" });
  const [isSaving, setIsSaving] = useState(false);

  function loadProducts() {
    setIsLoading(true);
    fetchCrafterProducts()
      .then(setProducts)
      .catch(() => showErrorToast("Could not load your products."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openEdit(product) {
    setEditingProduct(product);
    setEditForm({ title: product.title, price: product.price, stock: product.stock });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProductById(editingProduct.id, {
        title: editForm.title,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });
      showSuccessToast("Product updated.");
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      showErrorToast(err.message || "Could not update product.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProductById(id);
      showSuccessToast("Product deleted.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      showErrorToast(err.message || "Could not delete product.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-10">
            My Products
          </h1>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader size="lg" label="Loading your products..." />
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <p className="text-center text-ink/60 dark:text-paper/60 py-12">
              You haven&apos;t uploaded any products yet.
            </p>
          )}

          {!isLoading && products.length > 0 && (
            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-4"
                >
                  <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink dark:text-paper truncate">{product.title}</p>
                    <p className="text-sm text-ink/60 dark:text-paper/60">
                      ₹{product.price} &middot; {product.stock} in stock
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
                Showcase Gallery
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {products.map((product) => (
                  <img
                    key={product.id}
                    src={product.image}
                    alt={product.title}
                    className="w-full h-24 object-cover rounded-lg border border-ink/10 dark:border-paper/10"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />

      <Modal isOpen={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} title="Edit Product">
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
          <Input
            label="Product Name"
            value={editForm.title}
            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
            />
            <Input
              label="Stock"
              type="number"
              value={editForm.stock}
              onChange={(e) => setEditForm((p) => ({ ...p, stock: e.target.value }))}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Modal>
    </>
  );
}

export default CrafterMyProducts;
