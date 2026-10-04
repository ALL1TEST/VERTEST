import { create } from "zustand";
import type { ViewType } from "./types";

interface NavigationStore {
  view: ViewType;
  articleSlug: string | null;
  blogCategory: string | null;
  navigateTo: (view: ViewType, articleSlug?: string | null, category?: string | null) => void;
  goHome: () => void;
}

export function getViewUrl(view: ViewType, articleSlug?: string | null, category?: string | null): string {
  if (view === "article" && articleSlug) {
    return `/blog/${articleSlug}`;
  }
  if (view === "blog") {
    return category ? `/category/${category}` : "/blog";
  }
  if (view === "about") {
    return "/about";
  }
  if (view === "contact") {
    return "/contact";
  }
  if (view === "privacy") {
    return "/privacy";
  }
  return "/";
}

export const useNavigation = create<NavigationStore>((set) => ({
  view: "home",
  articleSlug: null,
  blogCategory: null,
  navigateTo: (view, articleSlug = null, category = null) => {
    set({ view, articleSlug, blogCategory: category });
    if (typeof window !== "undefined") {
      const targetUrl = getViewUrl(view, articleSlug, category);
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({}, "", targetUrl);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goHome: () => {
    set({ view: "home", articleSlug: null, blogCategory: null });
    if (typeof window !== "undefined") {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));
