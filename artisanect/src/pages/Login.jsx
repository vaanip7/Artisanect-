import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Button, Input, showSuccessToast, showErrorToast } from "../components/ui/index.js";

/**
 * Login
 * Login page built from the shared UI library. A controlled form
 * validates email and password, shows inline field errors via the
 * Input component, and reports the result with a toast notification.
 *
 * @returns {JSX.Element}
 */
function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!formData.email.includes("@")) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      showSuccessToast("Logged in successfully!");
    } else {
      showErrorToast("Please fix the errors below.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24 bg-paper dark:bg-ink transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl shadow-sm p-8 sm:p-10 transition-colors duration-300">
          <div className="text-center mb-8">
            <span className="inline-flex w-12 h-12 rounded-full bg-clay items-center justify-center text-paper font-display font-bold text-lg mb-3">
              A
            </span>
            <h1 className="font-display font-bold text-2xl text-ink dark:text-paper">Welcome Back</h1>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">
              Log in to manage your Artisanect account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Button type="submit" variant="primary" size="md">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-ink/60 dark:text-paper/60 mt-6">
            New to Artisanect?{" "}
            <a href="#signup" className="text-clay font-medium hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
