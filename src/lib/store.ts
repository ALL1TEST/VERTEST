import { create } from "zustand";
import type { ViewType } from "./types";

interface NavigationStore {
  view: ViewType;
  articleSlug: string | null;
  blogCategory: string | null;
  navigateTo: (view: ViewType, articleSlug?: string | null, category?: string | null) => void;
  goHome: () => void;
}

export const useNavigation = create<NavigationStore>((set) => ({
  view: "home",
  articleSlug: null,
  blogCategory: null,
  navigateTo: (view, articleSlug = null, category = null) => {
    set({ view, articleSlug, blogCategory: category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  goHome: () => {
    set({ view: "home", articleSlug: null, blogCategory: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}));
