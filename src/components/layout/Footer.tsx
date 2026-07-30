"use client";

import { Leaf } from "lucide-react";
import { siteConfig, categories } from "@/lib/site-config";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/lib/store";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 12a7 7 0 0 1 12.7-4.1 7 7 0 0 1-2.5 9.7l-1.2-2.5a2.5 2.5 0 0 0-1.3-4.8 2.5 2.5 0 0 0-2.4 3.9l1.2 2.5A7 7 0 0 1 5 12z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Pinterest", href: "https://pinterest.com", icon: PinterestIcon },
];

const exploreItems = [
  { label: "Plant Care", category: "plant-care" as const },
  { label: "Beginner Guides", category: "beginner-guides" as const },
  { label: "Design Ideas", category: "design-ideas" as const },
  { label: "Plant Profiles", category: "plant-profiles" as const },
  { label: "Tools & Supplies", category: "tools" as const },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { navigateTo, goHome } = useNavigation();

  return (
    <footer role="contentinfo" className="border-t bg-card">
      {/* Footer Main — 4-column per Skill Section 17 */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2"
              aria-label={`${siteConfig.name} — Home`}
            >
              <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-serif text-lg text-foreground">
                {siteConfig.name}
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5" role="list">
              {exploreItems.map((item) => (
                <li key={item.category}>
                  <button
                    onClick={() => navigateTo("blog", null, item.category)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories — 5-7 links max per Section 17 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5" role="list">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => navigateTo("blog", null, cat.slug)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5" role="list">
              <li>
                <button
                  onClick={() => navigateTo("about")}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("contact")}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("privacy")}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Footer Bottom per Skill Section 17 */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care for plant lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
