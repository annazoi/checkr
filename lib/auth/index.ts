import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord, { type DiscordProfile } from "next-auth/providers/discord";
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

async function mintSession(userId: string) {
  const sessionId = crypto.randomUUID();
  await redis.set(sessionKey(sessionId), userId, { ex: SESSION_MAX_AGE_SECONDS });
  await redis.sadd(userSessionsKey(userId), sessionId);
  return sessionId;
}

async function generateUniqueUsername(rawName: string) {
  const base = rawName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 25) || "player";
  let candidate = base;
  let suffix = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [clash] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, candidate))
      .limit(1);
    if (!clash) return candidate;
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
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
        // No password on file means this account was created via an OAuth
        // provider (e.g. Discord) -- there's nothing to compare against.
        if (!user.passwordHash) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          sessionId: await mintSession(user.id),
        };
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== "discord") return true; // Credentials already resolved everything in authorize()

      const discordProfile = profile as DiscordProfile | undefined;
      if (!discordProfile?.email || !discordProfile.verified) {
        return false; // require a verified email from Discord
      }

      const normalizedEmail = discordProfile.email.toLowerCase();
      let [dbUser] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

      if (!dbUser) {
        const username = await generateUniqueUsername(discordProfile.username);
        [dbUser] = await db
          .insert(users)
          .values({
            username,
            email: normalizedEmail,
            passwordHash: null,
            emailVerified: true,
            // Discord's own terms already require accounts to be 13+, so this
            // doesn't need a separate post-OAuth age-confirmation step.
            ageVerified: true,
          })
          .returning();
      }

      if (dbUser.status !== "active" || dbUser.deletedAt) return false;

      // Mutating `user` here propagates to the `jwt` callback's `user` param
      // for this same sign-in, which is how the shared session logic in
      // authConfig (same code path the Credentials provider uses) picks up
      // our internal id/role/sessionId uniformly regardless of provider.
      user.id = dbUser.id;
      user.role = dbUser.role;
      user.sessionId = await mintSession(dbUser.id);

      return true;
    },
  },
});
