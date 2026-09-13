import { NextRequest } from "next/server";
import { verifyCmsAuth, cmsUnauthorizedResponse, cmsSuccessResponse } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = verifyCmsAuth(req);

  if (!auth.authenticated) {
    return cmsUnauthorizedResponse(auth.error || "Unauthorized", auth.status || 401);
  }

  return cmsSuccessResponse({
    ok: true,
    service: "standard-cms",
    version: "1.0",
  });
}
