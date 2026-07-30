"use client";

import { useState, useCallback } from "react";
import { Link2, Check, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
  variant?: "sidebar" | "inline";
}

/* ── Brand SVG Icons (outline / monochrome) ────────────────────── */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 12a7 7 0 0 1 12.7-4.1 7 7 0 0 1-2.5 9.7l-1.2-2.5a2.5 2.5 0 0 0-1.3-4.8 2.5 2.5 0 0 0-2.4 3.9l1.2 2.5A7 7 0 0 1 5 12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m18 6-6 6 6 6" />
      <path d="m6 6 6 6-6 6" />
    </svg>
  );
}
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ── Share Link Config ──────────────────────────────────────────── */

interface ShareItem {
  name: string;
  icon: React.FC<{ className?: string }>;
  getUrl: (url: string, title: string) => string;
}

const shareItems: ShareItem[] = [
  {
    name: "Facebook",
    icon: FacebookIcon,
    getUrl: (u, t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    name: "X (Twitter)",
    icon: XIcon,
    getUrl: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    name: "Pinterest",
    icon: PinterestIcon,
    getUrl: (u, t) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(t)}`,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    getUrl: (u, t) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
  },
  {
    name: "WhatsApp",
    icon: WhatsAppIcon,
    getUrl: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + " " + u)}`,
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    getUrl: () => "#",
  },
  {
    name: "Email",
    icon: Mail,
    getUrl: (u, t) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`,
  },
];

/* ── Component ──────────────────────────────────────────────────── */

export function ShareButtons({ url, title, className = "", variant = "sidebar" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [url]);

  const isSidebar = variant === "sidebar";

  return (
    <div className={className}>
      {/* Label */}
      <div
        className={
          isSidebar
            ? "mb-4 flex items-center gap-2"
            : "mb-3 flex items-center gap-2"
        }
      >
        <Share2
          className={isSidebar ? "h-4 w-4 text-muted-foreground" : "h-4 w-4 text-muted-foreground"}
          aria-hidden="true"
        />
        <span className={isSidebar ? "text-xs font-medium uppercase tracking-wider text-muted-foreground" : "text-xs font-medium uppercase tracking-wider text-muted-foreground"}>
          Share
        </span>
      </div>

      {/* Icons */
      <div
        className={
          isSidebar
            ? "flex flex-col items-center gap-3"
            : "flex flex-wrap items-center gap-2"
        }
      >
        {shareItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.getUrl(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${item.name}`}
              className={
                isSidebar
                  ? "group flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "group flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              }
              title={`Share on ${item.name}`}
            >
              <Icon className={isSidebar ? "h-[18px] w-[18px]" : "h-4 w-4"} />
            </a>
          );
        })}

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Copied!" : "Copy link"}
          className={
            isSidebar
              ? "group flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              : "group flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          }
        >
          {copied ? (
            <Check className={isSidebar ? "h-[18px] w-[18px] text-green-600" : "h-4 w-4 text-green-600"} />
          ) : (
            <Link2 className={isSidebar ? "h-[18px] w-[18px]" : "h-4 w-4"} />
          )}
        </button>
      </div>
    </div>
  );
}
