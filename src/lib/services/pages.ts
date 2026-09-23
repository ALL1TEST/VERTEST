import { db } from "@/lib/db";

export interface PageItem {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  published: boolean;
  date?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export const baselinePages: PageItem[] = [
  {
    title: "About Verdant",
    slug: "about",
    excerpt: "We started Verdant with one simple belief: everyone deserves to experience the joy of growing healthy, beautiful indoor plants.",
    content: `<p>We started Verdant with one simple belief: everyone deserves to experience the joy of growing healthy, beautiful indoor plants.</p>
<h2>Our Mission</h2>
<p>Founded in 2023, Verdant was born from a frustration we hear all too often: “I love plants, but I keep killing them.”</p>
<p>Our founder, Elena Greenfield, spent over a decade as a professional horticulturist before realizing that the best plant care advice was locked behind paywalls, buried in jargon, or simply wrong.</p>
<p>Verdant exists to bridge that gap — to make expert-level plant knowledge accessible, actionable, and genuinely enjoyable to read. Every guide is researched, tested in real homes, and written with beginners in mind.</p>
<p><img src="/images/hero-plant.jpg" alt="Lush indoor garden" /></p>
<h2>What We Stand For</h2>
<h3>Plant-First Philosophy</h3>
<p>Every piece of advice we share is rooted in genuine care for plants and the people who grow them. We believe thriving plants lead to thriving spaces.</p>
<h3>Science-Backed Guidance</h3>
<p>Our care guides combine horticultural science with real-world experience. We test every tip in our own indoor gardens before publishing.</p>
<h3>Community Driven</h3>
<p>Verdant is built by plant lovers, for plant lovers. Our growing community of readers shapes the content we create.</p>
<h2>Join Our Growing Community</h2>
<p>Subscribe to our newsletter and get weekly plant care tips, new guides, and exclusive content delivered to your inbox.</p>`.trim(),
    coverImage: "/images/hero-plant.jpg",
    published: true,
    date: "2025-01-01",
    author: {
      name: "Elena Greenfield",
      avatar: "/images/author-elena.jpg",
      role: "Founder & Horticulturist",
    },
    seoTitle: "About Verdant — Indoor Plant Care Guides & Tips",
    seoDescription: "Learn about Verdant, our mission to make plant care accessible, and our founder Elena Greenfield.",
  },
  {
    title: "Contact Us",
    slug: "contact",
    excerpt: "Have a question, suggestion, or just want to say hello? We’d love to hear from you.",
    content: "<p>Have a question, suggestion, or just want to say hello? We’d love to hear from you.</p>",
    published: true,
    date: "2025-01-01",
    author: {
      name: "Verdant Team",
    },
    seoTitle: "Contact Us — Verdant",
    seoDescription: "Have a question, suggestion, or just want to say hello? Get in touch with the Verdant team.",
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    excerpt: "Our Privacy Policy describes how we collect, use, and protect your personal information.",
    content: `<p><em>Last updated: January 1, 2025</em></p>
<h2>1. Information We Collect</h2>
<p>When you visit Verdant, we may collect certain information to improve your experience. This includes:</p>
<ul>
  <li><strong>Information you provide:</strong> When you leave a comment, subscribe to our newsletter, or contact us, we collect your name, email address, and any other information you choose to share.</li>
  <li><strong>Automatically collected data:</strong> We may collect certain technical information such as your IP address, browser type, operating system, and pages visited to help us understand how visitors use our site.</li>
  <li><strong>Cookies:</strong> We use cookies to remember your preferences and improve your browsing experience.</li>
</ul>
<h2>2. How We Use Your Information</h2>
<p>We use the information we collect for the following purposes:</p>
<ul>
  <li>To respond to your comments, questions, and requests</li>
  <li>To send you our newsletter (only if you explicitly subscribe)</li>
  <li>To improve our website content and user experience</li>
  <li>To analyze site traffic and usage patterns</li>
  <li>To protect against spam, abuse, and security threats</li>
</ul>
<h2>3. Comments</h2>
<p>When you leave a comment on an article, your name and the comment content are displayed publicly. Your email address is collected but never displayed publicly. We reserve the right to moderate comments for spam or inappropriate content.</p>
<h2>4. Newsletter</h2>
<p>If you subscribe to our newsletter, we will use your email address solely to send you plant care tips, new articles, and updates about Verdant. You can unsubscribe at any time using the link provided in every email.</p>
<h2>5. Third-Party Services</h2>
<p>We may use third-party services for analytics or email delivery. These services may have their own privacy policies, and we encourage you to review them. We do not sell or share your personal information with third parties for marketing purposes.</p>
<h2>6. Data Security</h2>
<p>We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
<h2>7. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li>Request access to the personal data we hold about you</li>
  <li>Request correction of any inaccurate data</li>
  <li>Request deletion of your personal data</li>
  <li>Unsubscribe from our newsletter at any time</li>
</ul>
<h2>8. Children’s Privacy</h2>
<p>Our website is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take steps to remove it.</p>
<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.</p>
<h2>10. Contact Us</h2>
<p>If you have any questions about this Privacy Policy or your personal data, please contact us at <strong>privacy@verdant.com</strong>.</p>`.trim(),
    published: true,
    date: "2025-01-01",
    author: {
      name: "Verdant Legal",
    },
    seoTitle: "Privacy Policy — Verdant",
    seoDescription: "Read our Privacy Policy to understand how we collect and safeguard your information.",
  },
];

export async function getPagesFromDb(): Promise<PageItem[]> {
  try {
    const settings = await db.siteSetting.findMany({
      where: { key: { startsWith: "page:" } },
    });

    const dbPagesMap = new Map<string, PageItem>();
    for (const s of settings) {
      try {
        const parsed = JSON.parse(s.value);
        if (parsed && parsed.slug) {
          dbPagesMap.set(parsed.slug, parsed);
        }
      } catch {}
    }

    const result = baselinePages.map((baseline) => {
      if (dbPagesMap.has(baseline.slug)) {
        const parsed = dbPagesMap.get(baseline.slug);
        return {
          ...baseline,
          ...parsed,
          coverImage: parsed.coverImage !== undefined ? parsed.coverImage : baseline.coverImage,
          excerpt: parsed.excerpt !== undefined ? parsed.excerpt : baseline.excerpt,
        };
      }
      return baseline;
    });
    for (const [slug, item] of dbPagesMap.entries()) {
      if (!baselinePages.some((b) => b.slug === slug)) {
        result.push(item);
      }
    }
    return result;
  } catch (error) {
    console.error("[Verdant] getPagesFromDb error:", error);
    return baselinePages;
  }
}

export async function getPageBySlugFromDb(slug: string): Promise<PageItem | null> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: `page:${slug}` },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      const baseline = baselinePages.find((p) => p.slug === slug);
      if (baseline) {
        return {
          ...baseline,
          ...parsed,
          coverImage: parsed.coverImage !== undefined ? parsed.coverImage : baseline.coverImage,
          excerpt: parsed.excerpt !== undefined ? parsed.excerpt : baseline.excerpt,
        };
      }
      return parsed;
    }
  } catch (error) {
    console.error(`[Verdant] getPageBySlugFromDb error for [${slug}]:`, error);
  }

  const baseline = baselinePages.find((p) => p.slug === slug);
  return baseline || null;
}

export async function createOrUpdatePage(payload: Partial<PageItem> & { slug: string }): Promise<PageItem> {
  const existing = await getPageBySlugFromDb(payload.slug);
  const merged: PageItem = {
    title: payload.title || existing?.title || payload.slug,
    slug: payload.slug,
    content: payload.content !== undefined ? payload.content : (existing?.content || ""),
    excerpt: payload.excerpt !== undefined ? payload.excerpt : (existing?.excerpt || ""),
    coverImage: payload.coverImage !== undefined ? payload.coverImage : (existing?.coverImage || null),
    published: payload.published !== undefined ? payload.published : (existing?.published ?? true),
    date: payload.date || existing?.date || new Date().toISOString().split("T")[0],
    author: payload.author || existing?.author,
    seoTitle: payload.seoTitle !== undefined ? payload.seoTitle : existing?.seoTitle,
    seoDescription: payload.seoDescription !== undefined ? payload.seoDescription : existing?.seoDescription,
  };

  await db.siteSetting.upsert({
    where: { key: `page:${payload.slug}` },
    update: { value: JSON.stringify(merged) },
    create: { key: `page:${payload.slug}`, value: JSON.stringify(merged) },
  });

  return merged;
}
