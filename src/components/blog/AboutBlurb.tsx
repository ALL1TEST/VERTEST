import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function AboutBlurb() {
  return (
    <section aria-labelledby="about-heading" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="about-heading"
            className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
          >
            Meet {siteConfig.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            We believe every home deserves a touch of green. {siteConfig.name} is a
            carefully curated space for plant lovers — from your first succulent to
            your hundredth rare find. Our guides are written by experienced
            horticulturists and reviewed for accuracy, so you can grow with
            confidence.
          </p>
          <div className="mt-6">
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                About our team
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
