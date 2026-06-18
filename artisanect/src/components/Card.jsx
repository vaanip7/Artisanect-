import React from "react";

function Card({ title, description, image, buttonText }) {
  return (
    <div className="group relative bg-white rounded-xl border border-ink/10 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Handmade stamp signature */}
      <span className="handmade-stamp absolute top-3 right-3 z-10 bg-paper border border-dashed border-clay text-clay text-[10px] font-display font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
        Handmade
      </span>

      <div className="h-48 sm:h-56 w-full overflow-hidden bg-ink/5">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-display font-semibold text-lg text-ink">{title}</h3>
        <p className="text-sm text-ink/70 leading-relaxed">{description}</p>

        <button
          type="button"
          className="mt-3 self-start bg-ink hover:bg-ink-light text-paper text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Card;
