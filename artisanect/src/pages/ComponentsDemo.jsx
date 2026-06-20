import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  Button,
  Input,
  Modal,
  Loader,
  showSuccessToast,
  showErrorToast,
} from "../components/ui/index.js";

/**
 * ComponentsDemo
 * A live showcase of every component in the shared UI library
 * (Button, Input, Modal, Toast, Loader). Acts as visual QA and as
 * living documentation for the design system.
 *
 * @returns {JSX.Element}
 */
function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailError(val && !val.includes("@") ? "Please enter a valid email address." : "");
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper dark:bg-ink transition-colors duration-300">
        <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay">
            Design System
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-paper mt-2 mb-10">
            UI Components Demo
          </h1>

          {/* Buttons */}
          <div className="mb-12">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
              Buttons
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="mb-12 max-w-sm">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
              Input
            </h2>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />
          </div>

          {/* Modal */}
          <div className="mb-12">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
              Modal
            </h2>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
              <p>
                This modal closes when you click the overlay, press the Escape key, or click the
                close button.
              </p>
            </Modal>
          </div>

          {/* Toast */}
          <div className="mb-12">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
              Toast
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => showSuccessToast("Saved successfully!")}>
                Trigger Success Toast
              </Button>
              <Button variant="outline" onClick={() => showErrorToast("Something went wrong.")}>
                Trigger Error Toast
              </Button>
            </div>
          </div>

          {/* Loader */}
          <div>
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paper mb-4">
              Loader
            </h2>
            <div className="flex items-center gap-6">
              <Loader size="sm" />
              <Loader size="md" />
              <Loader size="lg" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ComponentsDemo;
