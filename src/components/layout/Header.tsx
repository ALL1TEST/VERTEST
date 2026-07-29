"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navigationItems, siteConfig } from "@/lib/site-config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "bg-background/95 shadow-sm backdrop-blur-md" : "bg-background"}`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo — top-left per Skill Section 3 */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — Home`}
        >
          <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-serif text-xl tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation — max 6-8 items per Skill Section 16 */}
        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {navigationItems.map((item) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          {/* Search — icon button per Skill Section 16 */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search articles"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile menu — Sheet per Skill Section 27 */}
          <Sheet>
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
                {/* Mobile: logo + close */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
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
                  </Link>
                </div>

                {/* Mobile nav links — large touch targets per Section 14 */}
                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1" role="menu">
                    {navigationItems.map((item) => (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          role="menuitem"
                          className="block rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile search — expanded per Section 27 */}
                <div className="border-t pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search articles..."
                      aria-label="Search articles"
                      className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
