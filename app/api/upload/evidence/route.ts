import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import { apiError } from "@/lib/utils/api-response";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const body = (await request.json()) as HandleUploadBody;

  // No onUploadCompleted here: Vercel's completion webhook needs a publicly
  // reachable callback URL, which doesn't exist on localhost in dev. Instead
  // the client calls /api/upload/evidence/confirm directly once upload()
  // resolves, so dev and prod behave the same way.
  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ALLOWED_TYPES,
      maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
      addRandomSuffix: true,
    }),
  });

  return Response.json(jsonResponse);
}
