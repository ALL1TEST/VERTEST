"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, Search, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNavigation } from "@/lib/store";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Blog", action: "blog" as const },
  { label: "Plant Care", action: "category" as const, category: "plant-care" },
  { label: "Beginner Guides", action: "category" as const, category: "beginner-guides" },
  { label: "Design Ideas", action: "category" as const, category: "design-ideas" },
  { label: "Plant Profiles", action: "category" as const, category: "plant-profiles" },
  { label: "About", action: "about" as const },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { view, goHome, navigateTo, blogCategory } = useNavigation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = useCallback(
    (action: string, category?: string) => {
      if (action === "blog") {
        navigateTo("blog");
      } else if (action === "category" && category) {
        navigateTo("blog", null, category);
      } else if (action === "about") {
        navigateTo("about");
      } else {
        goHome();
      }
      setMobileMenuOpen(false);
    },
    [navigateTo, goHome]
  );

  const handleGoHome = useCallback(() => {
    goHome();
    setMobileMenuOpen(false);
  }, [goHome]);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "bg-background/95 shadow-sm backdrop-blur-md"
          : "bg-background"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <button
          onClick={goHome}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — Home`}
        >
          <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-serif text-xl tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {navItems.map((item) => {
            const isActive =
              (item.action === "blog" && view === "blog" && !blogCategory) ||
              (item.action === "category" && blogCategory === item.category) ||
              (item.action === "about" && view === "about");
            return (
              <li key={item.label} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleNav(item.action, item.category)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search articles"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigateTo("blog")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 overflow-y-auto custom-scrollbar"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleGoHome}
                    className="flex items-center gap-2"
                    aria-label={`${siteConfig.name} — Home`}
                  >
                    <Leaf
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    <span className="font-serif text-lg text-foreground">
                      {siteConfig.name}
                    </span>
                  </button>
                </div>

                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1" role="menu">
                    {navItems.map((item) => (
                      <li key={item.label} role="none">
                        <button
                          role="menuitem"
                          onClick={() => {
                            handleNav(item.action, item.category);
                          }}
                          className="block w-full rounded-md px-3 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
