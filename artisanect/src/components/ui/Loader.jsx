import React from "react";

/**
 * Loader
 * An animated spinner built purely with Tailwind CSS, used to indicate
 * loading or pending states.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Size of the spinner.
 * @param {string} [props.label="Loading..."] - Accessible label read by screen readers.
 * @returns {JSX.Element}
 */
function Loader({ size = "md", label = "Loading..." }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div role="status" className="inline-flex items-center gap-2">
      <span
        className={`${sizes[size]} rounded-full border-clay/25 border-t-clay dark:border-paper/20 dark:border-t-gold animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Loader;
