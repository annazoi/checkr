import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";
import { levelFromXp } from "@/lib/gamification/xp";
import { checkAndAwardBadges } from "@/lib/gamification/badges";
import { sendBadgeEmail } from "@/lib/smtp";

export async function applyXpDelta(userId: string, delta: number) {
  const [updated] = await db
    .update(users)
    .set({ xp: sql`GREATEST(0, ${users.xp} + ${delta})` })
    .where(eq(users.id, userId))
    .returning({ xp: users.xp, email: users.email });

  if (!updated) return;

  const { level } = levelFromXp(updated.xp ?? 0);
  await db.update(users).set({ level }).where(eq(users.id, userId));

  const newlyAwarded = await checkAndAwardBadges(userId);
  for (const slug of newlyAwarded) {
    await db.insert(notifications).values({
      userId,
      type: "badge_earned",
      title: "You earned a new badge",
      body: slug,
    });
    await sendBadgeEmail(updated.email, slug).catch((error) =>
      console.error("Failed to send badge email", error),
    );
  }
}
