export const XP_EVENTS = {
  reportPublished: 5,
  descriptionIncluded: 5,
  evidenceIncluded: 15,
  markedHelpful: 20,
  evidenceConfirmed: 25,
  firstReportOnSource: 10,
  removedForSpam: -15,
  removedForViolation: -30,
} as const;

export function levelFromXp(xp: number): { level: number; name: string } {
  if (xp >= 5000) return { level: 5, name: "Community Guardian" };
  if (xp >= 2000) return { level: 4, name: "Expert Contributor" };
  if (xp >= 500) return { level: 3, name: "Trusted Reporter" };
  if (xp >= 100) return { level: 2, name: "Contributor" };
  return { level: 1, name: "Scout" };
}
