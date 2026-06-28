import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Loader, showErrorToast } from "../components/ui/index.js";
import { fetchProfile } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Profile
 * Role-aware profile page — shows the logged-in customer's or crafter's
 * demo profile details fetched from the backend.
 *
 * @returns {JSX.Element}
 */
function Profile() {
  const { role, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProfile(role)
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch(() => {
        showErrorToast("Could not load profile.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mb-8">
            My Profile
          </h1>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader size="lg" label="Loading profile..." />
            </div>
          )}

          {!isLoading && profile && (
            <div className="bg-white dark:bg-ink-light border border-ink/10 dark:border-paper/10 rounded-xl p-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-full bg-clay flex items-center justify-center text-paper font-display font-bold text-xl">
                  {profile.name?.charAt(0)}
                </span>
                <div>
                  <p className="font-display font-semibold text-lg text-ink dark:text-paper">{profile.name}</p>
                  <span className="text-xs uppercase tracking-wider text-clay font-semibold">{profile.role}</span>
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <dt className="text-ink/50 dark:text-paper/50">Email</dt>
                  <dd className="text-ink dark:text-paper">{profile.email}</dd>
                </div>
                <div>
                  <dt className="text-ink/50 dark:text-paper/50">Joined</dt>
                  <dd className="text-ink dark:text-paper">{profile.joined}</dd>
                </div>
                {profile.craft && (
                  <div>
                    <dt className="text-ink/50 dark:text-paper/50">Craft</dt>
                    <dd className="text-ink dark:text-paper">{profile.craft}</dd>
                  </div>
                )}
              </dl>

              <button
                type="button"
                onClick={logout}
                className="mt-4 self-start text-sm font-medium text-red-500 hover:underline"
              >
                Log out
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
