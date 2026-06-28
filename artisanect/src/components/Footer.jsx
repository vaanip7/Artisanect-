import React from "react";
import { Link } from "react-router-dom";

const footerLinks = [
  { name: "About", path: "/about", internal: true },
  { name: "Components", path: "/components-demo", internal: true },
  { name: "Contact", path: "#contact", internal: false },
  { name: "Privacy Policy", path: "#privacy", internal: false },
];

const socialIcons = [
  {
    name: "Facebook",
    href: "#",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94Z",
  },
  {
    name: "Instagram",
    href: "#",
    path: "M12 2.16c2.67 0 2.99.01 4.04.06 2.71.13 3.97 1.4 4.1 4.11.05 1.05.06 1.36.06 4.03 0 2.68-.01 2.99-.06 4.04-.13 2.7-1.39 3.97-4.1 4.1-1.05.05-1.36.06-4.04.06-2.67 0-2.99-.01-4.03-.06-2.72-.13-3.98-1.41-4.11-4.1-.05-1.05-.06-1.36-.06-4.04 0-2.67.02-2.98.06-4.03.13-2.71 1.4-3.98 4.11-4.11 1.05-.05 1.36-.06 4.03-.06ZM12 0C9.28 0 8.94.01 7.88.06 4.25.23.23 4.24.06 7.88.01 8.94 0 9.28 0 12s.01 3.06.06 4.12c.17 3.63 4.18 7.65 7.82 7.82C8.94 23.99 9.28 24 12 24s3.06-.01 4.12-.06c3.63-.17 7.65-4.18 7.82-7.82.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12C23.77 4.25 19.76.23 16.12.06 15.06.01 14.72 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z",
  },
  {
    name: "Twitter",
    href: "#",
    path: "M23.95 4.57a10 10 0 0 1-2.82.78 4.96 4.96 0 0 0 2.17-2.74 9.9 9.9 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.4 4.48A13.94 13.94 0 0 1 1.64 3.16a4.93 4.93 0 0 0 1.53 6.57A4.9 4.9 0 0 1 .96 9.3c-.001 2.4 1.7 4.5 4.1 4.99-1.06.29-2.21.36-3.34.13.94 2.94 3.66 5.08 6.89 5.14A9.84 9.84 0 0 1 0 21.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63a10.06 10.06 0 0 0 2.41-2.54Z",
  },
];

/**
 * Footer
 * Site-wide footer with brand summary, quick links, social icons, and
 * a copyright line. Intentionally kept on a dark band in both themes,
 * using a slightly deeper shade in dark mode to preserve contrast
 * against the rest of the page.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="mt-auto bg-ink dark:bg-ink-dark text-paper transition-colors duration-300">
      <div className="stitch-divider-light"></div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-clay flex items-center justify-center font-display font-bold text-sm">
              A
            </span>
            <span className="font-display font-bold text-lg">Artisanect</span>
          </div>
          <p className="text-sm text-paper/65 leading-relaxed max-w-xs">
            Empowering local artisans with a digital marketplace and AI-driven tools to reach customers everywhere.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold mb-3">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2">
            {footerLinks.map((link) => (
              <li key={link.name}>
                {link.internal ? (
                  <Link to={link.path} className="text-sm text-paper/75 hover:text-paper transition-colors">
                    {link.name}
                  </Link>
                ) : (
                  <a href={link.path} className="text-sm text-paper/75 hover:text-paper transition-colors">
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold mb-3">
            Follow Us
          </h4>
          <div className="flex items-center gap-3">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="w-9 h-9 rounded-full border border-paper/25 flex items-center justify-center hover:bg-clay hover:border-clay transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-paper">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 py-4 px-5 text-center text-xs text-paper/55">
        &copy; 2026 Artisanect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
