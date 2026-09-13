import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export interface CmsAuthResult {
  authenticated: boolean;
  error?: string;
  status?: number;
}

/**
 * Verifies standard CMS Bearer token authentication.
 * Compares the received token against process.env.CMS_CONNECTION_TOKEN using timingSafeEqual.
 * Never logs or exposes the token.
 */
export function verifyCmsAuth(req: Request | NextRequest): CmsAuthResult {
  const expectedToken = process.env.CMS_CONNECTION_TOKEN;
  if (!expectedToken) {
    return {
      authenticated: false,
      error: "CMS connection token is not configured on the server",
      status: 500,
    };
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return {
      authenticated: false,
      error: "Missing Authorization header",
      status: 401,
    };
  }

  const [scheme, receivedToken] = authHeader.trim().split(/\s+/);
  if (!scheme || scheme.toLowerCase() !== "bearer" || !receivedToken) {
    return {
      authenticated: false,
      error: "Invalid Authorization header format. Expected 'Bearer <token>'",
      status: 401,
    };
  }

  try {
    const receivedBuffer = Buffer.from(receivedToken, "utf8");
    const expectedBuffer = Buffer.from(expectedToken, "utf8");

    if (receivedBuffer.length !== expectedBuffer.length) {
      return {
        authenticated: false,
        error: "Unauthorized",
        status: 401,
      };
    }

    const isMatch = crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
    if (!isMatch) {
      return {
        authenticated: false,
        error: "Unauthorized",
        status: 401,
      };
    }

    return { authenticated: true };
  } catch {
    return {
      authenticated: false,
      error: "Unauthorized",
      status: 401,
    };
  }
}

/**
 * Creates an unauthorized response with no-cache headers.
 */
export function cmsUnauthorizedResponse(error = "Unauthorized", status = 401): NextResponse {
  return NextResponse.json(
    { ok: false, error },
    {
      status,
      headers: NO_CACHE_HEADERS,
    }
  );
}

/**
 * Creates a successful CMS response with no-cache headers.
 */
export function cmsSuccessResponse<T extends Record<string, unknown>>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}
