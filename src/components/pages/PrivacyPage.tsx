"use client";

import { useEffect, useState } from "react";

const defaultPrivacyContent = `
<p><em>Last updated: January 1, 2025</em></p>
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
<p>If you have any questions about this Privacy Policy or your personal data, please contact us at <strong>privacy@verdant.com</strong>.</p>
`.trim();

export function PrivacyPage() {
  const [page, setPage] = useState<{ title?: string; content?: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/pages?slug=privacy-policy')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data) {
          setPage(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const contentHtml = page?.content || defaultPrivacyContent;
  const title = page?.title || "Privacy Policy";

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div
          className="prose-article mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>
    </div>
  );
}
