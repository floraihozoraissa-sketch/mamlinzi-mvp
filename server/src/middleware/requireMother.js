const supabase = require("../config/supabase");

async function requireMother(req, res, next) {
  try {
    const { data: profile, error } = await supabase.from("profiles").select("id, role").eq("id", req.user.id).single();
    if (error || !profile) return res.status(403).json({ error: "MaMlinzi profile not found." });
    if (profile.role !== "mother") return res.status(403).json({ error: "Mother access required." });
    req.profile = profile;
    next();
  } catch (error) {
    console.error("MOTHER AUTHORIZATION ERROR:", error);
    return res.status(500).json({ error: "Could not verify mother authorization." });
  }
}

module.exports = requireMother;
