import React from "react";

/**
 * Button
 * A reusable, theme-aware button supporting multiple visual variants and sizes.
 *
 * @param {Object} props
 * @param {"primary"|"secondary"|"outline"} [props.variant="primary"] - Visual style of the button.
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Size of the button (controls padding/font-size).
 * @param {boolean} [props.disabled=false] - Disables the button and applies a muted style.
 * @param {"button"|"submit"|"reset"} [props.type="button"] - Native HTML button type.
 * @param {() => void} [props.onClick] - Click handler.
 * @param {React.ReactNode} props.children - Button label/content.
 * @returns {JSX.Element}
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-clay hover:bg-clay-dark text-paper",
    secondary:
      "bg-ink hover:bg-ink-light text-paper dark:bg-paper dark:text-ink dark:hover:bg-paper/90",
    outline:
      "bg-transparent border-2 border-clay text-clay hover:bg-clay hover:text-paper dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-ink",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
