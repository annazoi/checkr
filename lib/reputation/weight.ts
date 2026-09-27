// Report weighting, applied to the % calculations in the signal engine.
// Level overrides age: a long-tenured but still-new-tier account that has
// leveled up (via XP) is trusted more than raw account age alone suggests.
export function computeReportWeight(accountAgeDays: number, level: number | null) {
  if ((level ?? 1) >= 4) return 1.3;
  if (accountAgeDays < 30) return 0.25;
  if (accountAgeDays < 180) return 0.65;
  return 1.0;
}

export function accountAgeInDays(createdAt: Date) {
  return Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
}
