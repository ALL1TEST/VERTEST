"use client";

import Image from "next/image";
import { Leaf, Heart, Target, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const values = [
  {
    icon: Heart,
    title: "Plant-First Philosophy",
    description:
      "Every piece of advice we share is rooted in genuine care for plants and the people who grow them. We believe thriving plants lead to thriving spaces.",
  },
  {
    icon: Target,
    title: "Science-Backed Guidance",
    description:
      "Our care guides combine horticultural science with real-world experience. We test every tip in our own indoor gardens before publishing.",
  },
  {
    icon: MessageCircle,
    title: "Community Driven",
    description:
      "Verdant is built by plant lovers, for plant lovers. Our growing community of readers shapes the content we create and the topics we cover.",
  },
];


export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            Our Story
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            About {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We started {siteConfig.name} with one simple belief: everyone deserves to
            experience the joy of growing healthy, beautiful indoor plants.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
                Our Mission
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2023, {siteConfig.name} was born from a frustration we hear
                  all too often: &ldquo;I love plants, but I keep killing them.&rdquo;
                </p>
                <p>
                  Our founder, Elena Greenfield, spent over a decade as a professional
                  horticulturist before realizing that the best plant care advice was
                  locked behind paywalls, buried in jargon, or simply wrong.
                </p>
                <p>
                  {siteConfig.name} exists to bridge that gap — to make expert-level plant
                  knowledge accessible, actionable, and genuinely enjoyable to read. Every
                  guide is researched, tested in real homes, and written with beginners in
                  mind.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src="/images/hero-plant.jpg"
                alt="Lush indoor garden"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            What We Stand For
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
            Join Our Growing Community
          </h2>
          <p className="mt-3 text-muted-foreground">
            Subscribe to our newsletter and get weekly plant care tips, new guides, and exclusive content delivered to your inbox.
          </p>
        </div>
      </section>
    </div>
  );
}