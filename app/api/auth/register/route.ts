import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import { sendVerificationEmail } from "@/lib/resend";
import { registerSchema } from "@/lib/validation/schemas";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

const VERIFICATION_TOKEN_TTL_SECONDS = 24 * 60 * 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(400, "We couldn't validate that submission.", parsed.error.flatten());
  }

  const { username, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const [existing] = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(or(eq(users.email, normalizedEmail), eq(users.username, username)))
    .limit(1);

  if (existing) {
    const field = existing.email === normalizedEmail ? "email" : "username";
    return apiError(409, `That ${field} is already in use.`);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      username,
      email: normalizedEmail,
      passwordHash,
      ageVerified: true,
      emailVerified: false,
    })
    .returning({ id: users.id, email: users.email });

  const token = crypto.randomUUID();
  await redis.set(`verify:${token}`, user.id, { ex: VERIFICATION_TOKEN_TTL_SECONDS });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  await sendVerificationEmail(user.email, verifyUrl);

  return apiSuccess({ email: user.email }, 201);
}
