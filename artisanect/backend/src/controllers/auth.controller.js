import { getProfileByRole } from "../data/users.js";

/** POST /api/login — dummy role-based login (no real password check yet) */
export function login(req, res) {
  const { role } = req.body;

  if (role !== "customer" && role !== "crafter") {
    return res.status(400).json({
      success: false,
      message: "Field 'role' must be either 'customer' or 'crafter'.",
    });
  }

  const profile = getProfileByRole(role);
  res.status(200).json({
    success: true,
    data: { ...profile, token: `demo-token-${role}` },
  });
}

/** GET /api/profile?role=customer|crafter — fetch the dummy profile for a role */
export function getProfile(req, res) {
  const { role } = req.query;
  const profile = getProfileByRole(role);

  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found for that role." });
  }

  res.status(200).json({ success: true, data: profile });
}
