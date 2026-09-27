import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validation/schemas";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

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
      emailVerified: true,
    })
    .returning({ id: users.id, email: users.email });

  return apiSuccess({ email: user.email }, 201);
}
