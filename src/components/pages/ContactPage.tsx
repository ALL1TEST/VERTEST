"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactPage({ initialPage }: { initialPage?: any }) {
  const [page, setPage] = useState<{ title?: string; content?: string } | null>(initialPage || null);
  const [isLoaded, setIsLoaded] = useState(Boolean(initialPage));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/pages?slug=contact', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data) {
          setPage(data);
          setIsLoaded(true);
        }
      })
      .catch(() => {
        if (active) setIsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  }

  const title = page?.title ?? "Contact Us";
  // Zero decalage/flicker: strictly use page content (no hardcoded fallback)
  const contentHtml = page?.content ?? "";

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {contentHtml && contentHtml.trim() ? (
            <div
              className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : null}
        </div>
      </section>

      <section className="pt-16 pb-0 sm:pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl text-foreground">Message Sent!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thank you for reaching out. We’ll get back to you as soon as possible.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    placeholder="What's this about?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
