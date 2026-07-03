import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
  const { user, role } = useAuth();
  if (!user) return null;

  const initials = user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const fields = [
    { label: "Full Name",     value: user.name },
    { label: "Email",         value: user.email },
    { label: "Account Type",  value: role === "crafter" ? "Crafter (Artisan)" : "Customer" },
    { label: "Member Since",  value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—" },
    ...(user.craft ? [{ label: "Primary Craft", value: user.craft }] : []),
    { label: "Account ID",    value: user.id },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-20 h-20 rounded-full bg-clay flex items-center justify-center text-paper font-display font-bold text-2xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink dark:text-paper">{user.name}</h1>
              <p className="text-sm text-ink/55 dark:text-paper/55 capitalize">{role} · {user.email}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-2xl overflow-hidden">
            {fields.map((f, i) => (
              <div key={f.label} className={`flex items-center px-6 py-4 gap-4 ${i < fields.length - 1 ? "border-b border-ink/8 dark:border-paper/8" : ""}`}>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink/45 dark:text-paper/45 w-32 flex-shrink-0">{f.label}</span>
                <span className="text-sm text-ink/80 dark:text-paper/80 break-all">{f.value}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
