import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next";

const key = process.env.ARCJET_KEY ?? "";

// /api/auth/register: 5 requests per IP per hour
export const ajRegisterLimiter = arcjet({
  key,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    slidingWindow({ mode: "LIVE", interval: "1h", max: 5 }),
  ],
});

// /api/auth/login (NextAuth credentials callback): 10 requests per IP per 15 minutes
export const ajLoginLimiter = arcjet({
  key,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    slidingWindow({ mode: "LIVE", interval: "15m", max: 10 }),
  ],
});

// /api/upload/evidence: 10 per user per day -- keyed by authenticated user id
// so multiple users behind the same IP (NAT, campus wifi) don't share a bucket.
export const ajUploadLimiter = arcjet({
  key,
  characteristics: ["userId"],
  rules: [
    shield({ mode: "LIVE" }),
    slidingWindow({ mode: "LIVE", interval: "1d", max: 10 }),
  ],
});

// All other API routes: 100 requests per IP per minute (bot protection)
export const ajGeneralLimiter = arcjet({
  key,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    slidingWindow({ mode: "LIVE", interval: "1m", max: 100 }),
  ],
});
