import { redis } from "@/lib/redis";

const DAY_SECONDS = 24 * 60 * 60;
const WEEK_SECONDS = 7 * DAY_SECONDS;
const MONTH_SECONDS = 30 * DAY_SECONDS;

type Tier = { dailyMax: number; perSourceMax: number; perSourceWindowSeconds: number };

function tierFor(accountAgeDays: number): Tier {
  if (accountAgeDays < 30) {
    return { dailyMax: 2, perSourceMax: 1, perSourceWindowSeconds: WEEK_SECONDS };
  }
  if (accountAgeDays < 180) {
    return { dailyMax: 5, perSourceMax: 3, perSourceWindowSeconds: MONTH_SECONDS };
  }
  return { dailyMax: 10, perSourceMax: 5, perSourceWindowSeconds: MONTH_SECONDS };
}

async function countInWindow(key: string, windowSeconds: number) {
  const windowStart = Date.now() - windowSeconds * 1000;
  await redis.zremrangebyscore(key, 0, windowStart);
  return redis.zcard(key);
}

async function recordEvent(key: string, windowSeconds: number) {
  const now = Date.now();
  await redis.zadd(key, { score: now, member: `${now}-${crypto.randomUUID()}` });
  await redis.expire(key, windowSeconds);
}

export async function checkReportRateLimit(
  userId: string,
  gameSourceId: string,
  accountAgeDays: number,
) {
  const tier = tierFor(accountAgeDays);
  const dailyKey = `ratelimit:reports:daily:${userId}`;
  const perSourceKey = `ratelimit:reports:source:${userId}:${gameSourceId}`;

  const [dailyCount, perSourceCount] = await Promise.all([
    countInWindow(dailyKey, DAY_SECONDS),
    countInWindow(perSourceKey, tier.perSourceWindowSeconds),
  ]);

  if (dailyCount >= tier.dailyMax) {
    return {
      allowed: false as const,
      message: "You've reached your daily report limit. Please try again tomorrow.",
    };
  }
  if (perSourceCount >= tier.perSourceMax) {
    return {
      allowed: false as const,
      message: "You've already reported on this source recently.",
    };
  }

  return {
    allowed: true as const,
    commit: () =>
      Promise.all([
        recordEvent(dailyKey, DAY_SECONDS),
        recordEvent(perSourceKey, tier.perSourceWindowSeconds),
      ]),
  };
}
