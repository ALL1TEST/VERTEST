import Link from "next/link";
import { Sprout, BookOpen, Lamp, Flower2, Shovel, Scissors } from "lucide-react";
import { categories } from "@/lib/site-config";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  BookOpen,
  Lamp,
  Flower2,
  Shovel,
  Scissors,
};

export function CategoryLinks() {
  return (
    <section aria-labelledby="categories-heading" className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h2
          id="categories-heading"
          className="sr-only"
        >
          Browse by Category
        </h2>
        {/* Grid of icon + label per Section 18 */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Sprout;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2.5 rounded-xl p-3 text-center transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-4"
                aria-label={`Browse ${cat.name} articles`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-foreground sm:text-sm">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
