"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulated — no backend per task spec
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <section
        aria-labelledby="newsletter-heading"
        className="border-t border-y bg-primary py-12 sm:py-16"
      >
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-foreground/20">
            <Send className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <h2
            id="newsletter-heading"
            className="mt-4 font-serif text-2xl text-primary-foreground sm:text-3xl"
          >
            You&apos;re in!
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Check your inbox for a welcome email. We can&apos;t wait to help you grow.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-t border-y bg-primary py-12 sm:py-16"
    >
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        {/* Benefit-driven headline per Skill Section 25 */}
        <h2
          id="newsletter-heading"
          className="font-serif text-2xl text-primary-foreground sm:text-3xl"
        >
          Grow with us every week
        </h2>
        {/* Social proof per Skill Section 25 */}
        <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
          Join 25,000+ plant lovers getting weekly care tips, new guides, and exclusive content.
        </p>

        {/* Email-only form per Skill Section 25 — highest conversion */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-0 sm:mx-auto sm:max-w-md"
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            aria-describedby="newsletter-hint"
            className="h-12 rounded-r-none border-0 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 sm:flex-1"
          />
          <Button
            type="submit"
            disabled={status === "loading" || !email}
            className="h-12 rounded-l-none bg-primary-foreground text-primary hover:bg-primary-foreground/90 sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Subscribing…
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        {/* Privacy reassurance per Skill Section 25 */}
        <p
          id="newsletter-hint"
          className="mt-3 text-xs text-primary-foreground/60"
        >
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
