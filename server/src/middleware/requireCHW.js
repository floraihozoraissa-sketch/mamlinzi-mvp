const supabase = require("../config/supabase");

async function requireCHW(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", req.user.id)
      .single();

    if (error || !profile) {
      console.error("CHW PROFILE ERROR:", error);

      return res.status(403).json({
        error: "MaMlinzi profile not found.",
      });
    }

    if (profile.role !== "chw") {
      return res.status(403).json({
        error: "CHW access required.",
      });
    }

    req.profile = profile;

    next();
  } catch (error) {
    console.error("CHW AUTHORIZATION ERROR:", error);

    return res.status(500).json({
      error: "Could not verify CHW authorization.",
    });
  }
}

module.exports = requireCHW;