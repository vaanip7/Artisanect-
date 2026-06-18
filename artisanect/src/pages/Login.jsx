import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24">
        <div className="w-full max-w-md bg-white border border-ink/10 rounded-2xl shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-flex w-12 h-12 rounded-full bg-clay items-center justify-center text-paper font-display font-bold text-lg mb-3">
              A
            </span>
            <h1 className="font-display font-bold text-2xl text-ink">Welcome Back</h1>
            <p className="text-sm text-ink/60 mt-1">Log in to manage your Artisanect account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/50 focus:border-clay"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/50 focus:border-clay"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-clay hover:bg-clay-dark text-paper font-semibold py-3 rounded-md transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-ink/60 mt-6">
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
