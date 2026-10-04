"use client";

import { ArticlesProvider } from "@/hooks/use-articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ArticlesProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </ArticlesProvider>
  );
}
