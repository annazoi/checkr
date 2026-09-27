import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redis } from "@/lib/redis";
import { loginSchema } from "@/lib/validation/schemas";
import { authConfig, sessionKey, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/config";

// This file (and its bcrypt/Drizzle dependencies) must only be imported from
// Node runtime contexts -- API routes and server components. middleware.ts
// uses lib/auth/config.ts directly instead, since it runs on the Edge runtime.

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

export async function revokeSession(sessionId: string) {
  await redis.del(sessionKey(sessionId));
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
