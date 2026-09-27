import sharp from "sharp";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reportEvidence } from "@/lib/db/schema";
import { getObjectBuffer, putObjectBuffer } from "@/lib/r2";
import { scanFileForThreats } from "@/lib/security/scan";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return apiError(401, "Authentication required.");

  const body = await request.json().catch(() => null);
  const key = body?.key as string | undefined;

  if (!key || !key.startsWith(`evidence/raw/${session.user.id}/`)) {
    return apiError(400, "Invalid upload reference.");
  }

  let rawBuffer: Buffer;
  try {
    rawBuffer = await getObjectBuffer(key);
  } catch {
    return apiError(400, "We couldn't find that upload. Please try again.");
  }

  const scan = await scanFileForThreats(rawBuffer).catch((error) => {
    console.error("Evidence scan failed", error);
    return { clean: false, provider: "error" as const };
  });

  if (!scan.clean) {
    return apiError(422, "This file couldn't be verified as safe and was not accepted.");
  }

  // .rotate() auto-orients from EXIF before sharp's default re-encode strips
  // all metadata (including that same orientation tag) -- otherwise a photo
  // taken sideways would end up sideways for good once the tag is gone.
  const processedBuffer = await sharp(rawBuffer).rotate().webp({ quality: 85 }).toBuffer();

  const processedKey = `evidence/processed/${session.user.id}/${crypto.randomUUID()}.webp`;
  await putObjectBuffer(processedKey, processedBuffer, "image/webp");

  const [evidence] = await db
    .insert(reportEvidence)
    .values({ userId: session.user.id, r2Key: processedKey, status: "pending_review" })
    .returning({ id: reportEvidence.id });

  return apiSuccess({ evidenceId: evidence.id });
}
