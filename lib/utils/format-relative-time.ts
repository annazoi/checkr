const UNITS: { limit: number; divisor: number; name: string }[] = [
  { limit: 60, divisor: 1, name: "second" },
  { limit: 3600, divisor: 60, name: "minute" },
  { limit: 86400, divisor: 3600, name: "hour" },
  { limit: 604800, divisor: 86400, name: "day" },
  { limit: 2629800, divisor: 604800, name: "week" },
  { limit: 31557600, divisor: 2629800, name: "month" },
];

export function formatRelativeTime(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 30) return "just now";

  for (const unit of UNITS) {
    if (seconds < unit.limit) {
      const value = Math.floor(seconds / unit.divisor);
      return `${value} ${unit.name}${value === 1 ? "" : "s"} ago`;
    }
  }

  const years = Math.floor(seconds / 31557600);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
