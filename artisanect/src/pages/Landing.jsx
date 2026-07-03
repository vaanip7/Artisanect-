import React from "react";
import { Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import { Loader } from "../components/ui/index.js";
import { useAuth } from "../context/AuthContext.jsx";

function Landing() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink">
        <Loader size="lg" label="Loading…" />
      </div>
    );
  }

  if (role === "crafter")  return <Navigate to="/dashboard" replace />;
  if (role === "customer") return <Home />;
  return <Login />;
}

export default Landing;
