const supabase = require("../config/supabase");

async function getPriorityCases(req, res) {
  try {
    // 1. Find only mothers assigned to the logged-in CHW
    const { data: motherProfiles, error: mothersError } =
      await supabase
        .from("mother_profiles")
        .select("id")
        .eq("assigned_chw_id", req.user.id);

    if (mothersError) {
      console.error("CHW MOTHERS ERROR:", mothersError);

      return res.status(500).json({
        error: "Could not load assigned mothers.",
      });
    }

    const motherIds =
      motherProfiles?.map((mother) => mother.id) || [];

    // No mothers assigned to this CHW
    if (motherIds.length === 0) {
      return res.json({
        cases: [],
      });
    }

    // 2. Get risk assessments belonging only to those mothers
    const { data: assessments, error: assessmentsError } =
      await supabase
        .from("risk_assessments")
        .select(`
          id,
          priority,
          triggered_rules,
          recommendation,
          created_at,
          health_checkins!inner (
            id,
            submitted_at,
            mother_id,
            mother_profiles!inner (
              id,
              user_id,
              assigned_chw_id,
              profiles!mother_profiles_user_id_fkey (
                full_name,
                phone
              )
            )
          )
        `)
        .in("health_checkins.mother_id", motherIds)
        .order("created_at", {
          ascending: false,
        });

    if (assessmentsError) {
      console.error(
        "CHW ASSESSMENTS ERROR:",
        assessmentsError
      );

      return res.status(500).json({
        error: "Could not load priority cases.",
      });
    }

    return res.json({
      cases: assessments || [],
    });

  } catch (error) {
    console.error("CHW CASES ERROR:", error);

    return res.status(500).json({
      error: "Could not load CHW cases.",
    });
  }
}

module.exports = {
  getPriorityCases,
};