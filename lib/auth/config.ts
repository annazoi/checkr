import type { NextAuthConfig } from "next-auth";
import { redis } from "@/lib/redis";

// Kept separate from lib/auth/index.ts (which pulls in the Credentials
// provider and bcrypt, a native Node module) so middleware -- which runs on
// the Edge runtime -- can verify sessions without bundling Node-only code.
// See https://authjs.dev/guides/edge-compatibility.

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export function sessionKey(sessionId: string) {
  return `session:${sessionId}`;
}

export function userSessionsKey(userId: string) {
  return `user-sessions:${userId}`;
}

export const authConfig = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.sessionId = user.sessionId;
      }

      if (!token.sessionId) return null;

      const activeUserId = await redis.get<string>(sessionKey(token.sessionId));
      if (!activeUserId || activeUserId !== token.sub) return null;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && token.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export { SESSION_MAX_AGE_SECONDS };
