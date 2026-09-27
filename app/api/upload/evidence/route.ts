import { auth } from "@/lib/auth";
import { ajUploadLimiter } from "@/lib/arcjet";
import { createPresignedUploadUrl } from "@/lib/r2";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const decision = await ajUploadLimiter.protect(request, { userId: session.user.id });
  if (decision.isDenied()) {
    return apiError(429, "You've reached today's upload limit.");
  }

  const body = await request.json().catch(() => null);
  const contentType = body?.contentType as string | undefined;
  const size = body?.size as number | undefined;

  if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
    return apiError(400, "Only image files are supported.");
  }
  if (!size || size > MAX_FILE_SIZE_BYTES) {
    return apiError(400, "Images must be 5MB or smaller.");
  }

  const key = `evidence/raw/${session.user.id}/${crypto.randomUUID()}`;
  const uploadUrl = await createPresignedUploadUrl(key, contentType);

  return apiSuccess({ uploadUrl, key });
}
