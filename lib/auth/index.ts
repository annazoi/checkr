import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import { loginSchema } from "@/lib/validation/schemas";
import { authConfig, sessionKey, userSessionsKey, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/config";

// This file (and its bcrypt/Drizzle dependencies) must only be imported from
// Node runtime contexts -- API routes and server components. middleware.ts
// uses lib/auth/config.ts directly instead, since it runs on the Edge runtime.

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

export async function revokeSession(sessionId: string) {
  await redis.del(sessionKey(sessionId));
}

// Used by the "log out everywhere" settings action: every login SADDs its
// sessionId into this per-user set, so all of them can be revoked at once.
export async function revokeAllSessions(userId: string) {
  const key = userSessionsKey(userId);
  const sessionIds = await redis.smembers(key);
  if (sessionIds.length > 0) {
    await Promise.all(sessionIds.map((id) => redis.del(sessionKey(id))));
  }
  await redis.del(key);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase()))
          .limit(1);

        if (!user || user.status !== "active" || user.deletedAt) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        const sessionId = crypto.randomUUID();
        await redis.set(sessionKey(sessionId), user.id, {
          ex: SESSION_MAX_AGE_SECONDS,
        });
        await redis.sadd(userSessionsKey(user.id), sessionId);

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          sessionId,
        };
      },
    }),
  ],
});
