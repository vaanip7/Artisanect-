import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Footer from "../components/Footer.jsx";
import DevicePreview from "../components/DevicePreview.jsx";

const products = [
  {
    title: "Madhubani Painting",
    description:
      "Vibrant folk art from Bihar, hand-painted with natural dyes depicting nature, mythology, and everyday life.",
    image:
      "https://images.unsplash.com/photo-1582561833832-fc1c91d8cab1?auto=format&fit=crop&w=800&q=80",
    buttonText: "View Product",
  },
  {
    title: "Handwoven Basket",
    description:
      "Sturdy, eco-friendly baskets hand-woven from natural fibers by skilled rural artisans.",
    image:
      "https://images.unsplash.com/photo-1622560481156-01af9b3f7df1?auto=format&fit=crop&w=800&q=80",
    buttonText: "View Product",
  },
  {
    title: "Wooden Handicraft",
    description:
      "Intricately carved wooden decor and figurines, showcasing generations of traditional craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
    buttonText: "View Product",
  },
];

/**
 * Home
 * Landing page: Navbar, Hero banner, a responsive grid of featured
 * artisan product cards, and the Footer. Also mounts the DevicePreview
 * QA toggle for visually testing responsive breakpoints.
 *
 * @returns {JSX.Element}
 */
function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <Hero />

        <section id="products" className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-clay">
              Curated Crafts
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper mt-2">
              Featured Artisan Products
            </h2>
            <p className="text-ink/65 dark:text-paper/65 mt-3 text-sm sm:text-base">
              Every piece is made by hand and tells a story of skill passed down through generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <Card
                key={product.title}
                title={product.title}
                description={product.description}
                image={product.image}
                buttonText={product.buttonText}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <DevicePreview />
    </>
  );
}

export default Home;
