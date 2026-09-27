import type { DefaultSession } from "next-auth";

type AppRole = "user" | "moderator" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: AppRole;
    sessionId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionId?: string;
    role?: AppRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    sessionId?: string;
    role?: AppRole;
  }
}
