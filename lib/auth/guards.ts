export type Role = "user" | "moderator" | "admin";

// Mirrors the allow-list role check pattern (RolesGuard) used elsewhere in
// our stack: no required roles means the route is open to any authenticated
// user, and "admin" always passes regardless of the allow-list.
export function hasRole(role: Role | undefined | null, allowed: Role[]): boolean {
  if (allowed.length === 0) return true;
  if (!role) return false;
  if (role === "admin") return true;
  return allowed.includes(role);
}
