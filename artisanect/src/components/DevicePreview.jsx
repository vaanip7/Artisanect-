import React, { useState } from "react";

const devices = [
  { id: "iphone", label: "iPhone", width: 390, height: 760 },
  { id: "android", label: "Android", width: 412, height: 824 },
];

function DesktopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <rect x="2" y="4" width="20" height="13" rx="1.5" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

/**
 * Floating device-preview toggle for QA/demo purposes.
 * Uses a real <iframe> (not a resized div) so that Tailwind's
 * responsive breakpoints genuinely re-evaluate against the
 * device width, the same way they would in a real phone browser.
 */
/**
 * DevicePreview
 * Floating QA/demo toggle that opens a true device-width iframe preview
 * (iPhone or Android) so Tailwind's responsive breakpoints genuinely
 * re-evaluate against real device dimensions, rather than just visually
 * squeezing a div. "Desktop" closes the overlay and acts as a reset.
 * Renders nothing when already embedded inside its own preview iframe,
 * to avoid recursive toggle bars.
 *
 * @returns {JSX.Element|null}
 */
function DevicePreview() {
  const [active, setActive] = useState(null); // null = desktop / closed

  // Avoid rendering this control again inside its own preview iframe.
  const isEmbedded = typeof window !== "undefined" && window.self !== window.top;
  if (isEmbedded) return null;

  const selected = devices.find((d) => d.id === active);

  return (
    <>
      {/* Floating toggle bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-ink text-paper rounded-full shadow-xl px-2 py-1.5 border border-paper/10">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
            !active ? "bg-clay text-paper" : "text-paper/65 hover:text-paper"
          }`}
        >
          <DesktopIcon /> Desktop
        </button>
        {devices.map((d) => (
          <button
            type="button"
            key={d.id}
            onClick={() => setActive(d.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
              active === d.id ? "bg-clay text-paper" : "text-paper/65 hover:text-paper"
            }`}
          >
            <PhoneIcon /> {d.label}
          </button>
        ))}
      </div>

      {/* Device frame overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 px-4"
          onClick={() => setActive(null)}
        >
          <div className="flex items-center gap-3 text-paper text-sm" onClick={(e) => e.stopPropagation()}>
            <span className="font-display font-semibold">{selected.label} Preview</span>
            <span className="text-paper/50">
              {selected.width}&times;{selected.height}px
            </span>
          </div>

          <div
            className="bg-black rounded-[2.2rem] p-2.5 shadow-2xl"
            style={{ width: selected.width + 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-paper dark:bg-ink-dark rounded-[1.7rem] overflow-hidden"
              style={{ width: selected.width, height: selected.height }}
            >
              <iframe
                src="/"
                title={`${selected.label} preview`}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive(null)}
            className="text-paper/70 hover:text-paper text-sm font-medium underline"
          >
            Close preview
          </button>
        </div>
      )}
    </>
  );
}

export default DevicePreview;
