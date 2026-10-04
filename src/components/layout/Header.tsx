"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Plant Care", href: "/category/plant-care" },
  { label: "Beginner Guides", href: "/category/beginner-guides" },
  { label: "Design Ideas", href: "/category/design-ideas" },
  { label: "Plant Profiles", href: "/category/plant-profiles" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 lg:flex" role="menubar">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || (item.href !== "/blog" && pathname?.startsWith(item.href));
            return (
              <li key={item.label} role="none">
                <Link
                  role="menuitem"
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Search articles"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/blog">
              <Search className="h-5 w-5" />
            </Link>
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
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
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

                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1" role="menu">
                    {navItems.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname === item.href || (item.href !== "/blog" && pathname?.startsWith(item.href));
                      return (
                        <li key={item.label} role="none">
                          <Link
                            role="menuitem"
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block w-full rounded-md px-3 py-3 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "text-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
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
