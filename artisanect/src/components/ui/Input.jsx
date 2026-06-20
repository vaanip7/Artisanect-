import React from "react";

/**
 * Input
 * A labeled, theme-aware text input with built-in validation error display.
 *
 * @param {Object} props
 * @param {string} [props.label] - Label text displayed above the field.
 * @param {string} [props.placeholder] - Placeholder text shown when empty.
 * @param {string} [props.type="text"] - HTML input type (text, email, password, etc).
 * @param {string} [props.value] - Controlled input value.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Change handler.
 * @param {string} [props.error] - Validation error message rendered below the field.
 * @param {string} [props.name] - Input `name` attribute.
 * @param {string} [props.id] - Input `id` attribute (also linked to the label via htmlFor).
 * @returns {JSX.Element}
 */
function Input({ label, placeholder, type = "text", value, onChange, error, name, id, ...rest }) {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-paper">
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-md border px-4 py-2.5 text-sm bg-white dark:bg-ink-light text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-ink/15 dark:border-paper/20 focus:ring-clay/50 focus:border-clay"
        }`}
        {...rest}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
