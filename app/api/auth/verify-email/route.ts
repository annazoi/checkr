import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/verify-email?status=invalid", origin),
    );
  }

  const userId = await redis.get<string>(`verify:${token}`);

  if (!userId) {
    return NextResponse.redirect(
      new URL("/auth/verify-email?status=expired", origin),
    );
  }

  await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));
  await redis.del(`verify:${token}`);

  return NextResponse.redirect(new URL("/?emailVerified=1", origin));
}
