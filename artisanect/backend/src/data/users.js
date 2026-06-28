/**
 * Dummy auth data — no real password storage or sessions yet (planned for
 * a later week alongside the real database). Login just confirms a role
 * and hands back a fixed demo profile for that role.
 */
const profiles = {
  customer: {
    name: "Asha Mehta",
    role: "customer",
    email: "asha.mehta@example.com",
    joined: "2026-02-14",
  },
  crafter: {
    name: "Manoj Kumar",
    role: "crafter",
    email: "manoj.kumar@example.com",
    joined: "2025-11-02",
    craft: "Wood Carving",
  },
};

export function getProfileByRole(role) {
  return profiles[role] || null;
}
