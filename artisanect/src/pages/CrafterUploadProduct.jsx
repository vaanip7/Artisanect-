import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, Loader, showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { uploadCrafterProduct } from "../services/api.js";

const CATEGORIES = [
  "Painting",
  "Pottery",
  "Wood Carving",
  "Textile",
  "Home Decor",
  "Jewellery",
  "Leather",
  "Wellness",
];

/**
 * CrafterUploadProduct
 * Form for a crafter to upload a new product. Submits straight to the
 * backend via `uploadCrafterProduct` so the product appears immediately
 * across the app (Home, Shop, My Products).
 *
 * @returns {JSX.Element}
 */
function CrafterUploadProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    price: "",
    quantity: "",
    tags: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Product name is required.";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Enter a valid price.";
    if (!form.quantity || Number(form.quantity) < 0) nextErrors.quantity = "Enter a valid quantity.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await uploadCrafterProduct({
        title: form.title,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.quantity),
        image: imagePreview || "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
        artisanName: "Manoj Kumar",
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      showSuccessToast("Product uploaded! It's now live in the catalog.");
      navigate("/crafter/products");
    } catch (err) {
      showErrorToast(err.message || "Could not upload product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-8">
            Upload Product
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-6 sm:p-8 flex flex-col gap-5"
          >
            <Input label="Product Name" name="title" value={form.title} onChange={handleChange} error={errors.title} placeholder="e.g. Hand-painted Bottle" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-ink dark:text-paper">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-md border border-ink/15 dark:border-paper/20 px-4 py-2.5 text-sm bg-white dark:bg-ink-light text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-clay/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-ink dark:text-paper">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product, materials, and craft technique..."
                className="w-full rounded-md border border-ink/15 dark:border-paper/20 px-4 py-2.5 text-sm bg-white dark:bg-ink-light text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 focus:outline-none focus:ring-2 focus:ring-clay/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} error={errors.price} placeholder="999" />
              <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} error={errors.quantity} placeholder="10" />
            </div>

            <Input label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} placeholder="handmade, eco-friendly" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="image" className="text-sm font-medium text-ink dark:text-paper">
                Upload Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-ink/70 dark:text-paper/70"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border border-ink/10 dark:border-paper/10" />
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader size="sm" label="Uploading..." /> : "Upload Product"}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CrafterUploadProduct;
