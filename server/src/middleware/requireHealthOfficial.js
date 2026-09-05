const supabase = require("../config/supabase");

async function requireHealthOfficial(
  req,
  res,
  next
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const { data: profile, error } =
      await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", req.user.id)
        .single();

    if (error || !profile) {
      return res.status(403).json({
        error: "MaMlinzi profile not found.",
      });
    }

    if (profile.role !== "health_official") {
      return res.status(403).json({
        error: "Health official access required.",
      });
    }

    req.profile = profile;

    next();

  } catch (error) {
    console.error(
      "HEALTH OFFICIAL AUTH ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "Could not verify authorization.",
    });
  }
}

module.exports = requireHealthOfficial;