import React from "react";
import { Toaster, toast } from "react-hot-toast";

/**
 * ToastContainer
 * Mounts react-hot-toast's <Toaster /> with Artisanect's theming applied.
 * Render this once near the root of the app (see App.jsx) — individual
 * pages should call `showSuccessToast` / `showErrorToast` rather than
 * rendering their own Toaster.
 *
 * @returns {JSX.Element}
 */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#22324A",
          color: "#FAF6EF",
          fontSize: "0.875rem",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: { primary: "#D6A23C", secondary: "#22324A" },
        },
        error: {
          iconTheme: { primary: "#BD5B38", secondary: "#22324A" },
        },
      }}
    />
  );
}

/**
 * showSuccessToast
 * Displays a success toast notification.
 *
 * @param {string} message - The message to display.
 */
export function showSuccessToast(message) {
  toast.success(message);
}

/**
 * showErrorToast
 * Displays an error toast notification.
 *
 * @param {string} message - The message to display.
 */
export function showErrorToast(message) {
  toast.error(message);
}
