import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function About() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay">
            Our Story
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-2 mb-6">
            About Artisanect
          </h1>

          <div className="h-1 w-24 bg-clay rounded-full mb-8"></div>

          <p className="text-base sm:text-lg text-ink/75 leading-relaxed max-w-2xl">
            Artisanect is an AI-powered marketplace built to help local artisans and handicraft
            sellers grow their craft into a thriving digital business. Our mission is to bridge
            the gap between traditional skill and modern technology &mdash; using AI-driven
            product discovery, smart pricing insights, and simple digital tools so that every
            artisan, regardless of location or technical know-how, can showcase their work to
            customers around the world. We believe handmade craftsmanship deserves a digital home
            that respects its value, tells its story, and helps it thrive for generations to come.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-white border border-ink/10 rounded-xl p-6">
              <h3 className="font-display font-semibold text-ink mb-2">For Artisans</h3>
              <p className="text-sm text-ink/65">
                Easy-to-use tools to list products, manage orders, and reach new customers.
              </p>
            </div>
            <div className="bg-white border border-ink/10 rounded-xl p-6">
              <h3 className="font-display font-semibold text-ink mb-2">For Customers</h3>
              <p className="text-sm text-ink/65">
                Discover authentic, handmade products with verified artisan stories behind them.
              </p>
            </div>
            <div className="bg-white border border-ink/10 rounded-xl p-6">
              <h3 className="font-display font-semibold text-ink mb-2">Powered by AI</h3>
              <p className="text-sm text-ink/65">
                Smart recommendations and insights that help craft businesses grow sustainably.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;
