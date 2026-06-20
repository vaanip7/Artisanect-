import React from "react";

/**
 * Hero
 * Full-width landing banner for the Home page, featuring the main
 * headline, subheading, and a call-to-action that scrolls to the
 * featured products section.
 *
 * @returns {JSX.Element}
 */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink dark:bg-ink-dark transition-colors duration-300">
      {/* subtle background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1600&q=70"
          alt="Artisan weaving handicraft"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink dark:to-ink-dark"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 flex flex-col items-start gap-6">
        <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-gold border border-gold/40 rounded-full px-4 py-1.5">
          Handmade &middot; Verified Artisans &middot; AI Matched
        </span>

        <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-paper leading-tight max-w-3xl">
          Connecting Artisans to the Digital World
        </h1>

        <p className="text-base sm:text-lg text-paper/80 max-w-xl leading-relaxed">
          Discover unique handmade products crafted by talented artisans across India.
        </p>

        <a
          href="#products"
          className="mt-2 inline-flex items-center gap-2 bg-clay hover:bg-clay-dark text-paper font-semibold px-7 py-3.5 rounded-md shadow-lg shadow-clay/20 transition-colors"
        >
          Explore Products
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <div className="h-2 stitch-divider-light"></div>
    </section>
  );
}

export default Hero;
