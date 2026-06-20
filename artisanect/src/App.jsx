import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComponentsDemo from "./pages/ComponentsDemo.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastContainer } from "./components/ui/index.js";

/**
 * App
 * Root application component. Wraps every route in the global
 * ThemeProvider (light/dark mode) and mounts the toast notification
 * container once at the top level so any page can trigger toasts.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-paper text-ink dark:bg-ink dark:text-paper font-body transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/components-demo" element={<ComponentsDemo />} />
        </Routes>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
