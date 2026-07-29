"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Comment } from "@/lib/types";

function formatCommentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-foreground">{comment.name}</span>
            <span className="text-xs text-muted-foreground">says:</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap">{comment.content}</p>
          <time
            dateTime={comment.createdAt}
            className="mt-2 block text-xs text-muted-foreground"
          >
            {formatCommentDate(comment.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?articleSlug=${encodeURIComponent(articleSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // Silently fail — comments are non-critical
    }
  }, [articleSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSlug, name, email, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      const newComment: Comment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setName("");
      setEmail("");
      setContent("");
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="comments-heading">
      <h2
        id="comments-heading"
        className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
      >
        {comments.length > 0
          ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
          : "Leave a Reply"}
      </h2>

      {comments.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Your email address will not be published. Required fields are marked{" "}
          <span className="text-destructive">*</span>
        </p>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="comment-text" className="sr-only">Comment *</label>
          <Textarea
            id="comment-text"
            placeholder="Comment *"
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="comment-name" className="sr-only">Name *</label>
            <Input
              id="comment-name"
              placeholder="Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="comment-email" className="sr-only">Email *</label>
            <Input
              id="comment-email"
              type="email"
              placeholder="Email *"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
          <Send className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mt-10 divide-y">
          {comments.length > 0 && (
            <h3 className="font-serif text-xl tracking-tight text-foreground sm:text-2xl mb-4">
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </h3>
          )}
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}