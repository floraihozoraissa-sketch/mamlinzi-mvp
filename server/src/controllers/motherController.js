const supabase = require("../config/supabase");

async function getMotherDashboard(req, res) {
  try {

    console.log("AUTH USER ID:", req.user.id);
console.log("AUTH USER EMAIL:", req.user.email);
    // Find the maternal profile belonging to the logged-in user
    const { data: motherProfile, error: motherError } =
      await supabase
        .from("mother_profiles")
        .select(`
          id,
          pregnancy_start_date,
          profiles!mother_profiles_user_id_fkey (
            full_name,
            phone
          )
        `)
        .eq("user_id", req.user.id)
        .single();

    if (motherError || !motherProfile) {
      console.error("MOTHER DASHBOARD PROFILE ERROR:", motherError);

      return res.status(404).json({
        error: "Maternal profile not found.",
      });
    }

    // Get the mother's most recent check-in
    const { data: checkin, error: checkinError } =
      await supabase
        .from("health_checkins")
        .select(`
          id,
          submitted_at,
          status,
          risk_assessments (
            id,
            priority,
            triggered_rules,
            recommendation,
            created_at
          )
        `)
        .eq("mother_id", motherProfile.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (checkinError) {
      console.error("MOTHER DASHBOARD CHECK-IN ERROR:", checkinError);

      return res.status(500).json({
        error: "Could not load your latest check-in.",
      });
    }

    const assessment =
      checkin?.risk_assessments?.[0] || null;

    return res.json({
      profile: {
        fullName:
          motherProfile.profiles?.full_name || "Mother",
        phone:
          motherProfile.profiles?.phone || null,
        pregnancyStartDate:
          motherProfile.pregnancy_start_date || null,
      },

      latestCheckin: checkin
        ? {
            id: checkin.id,
            submittedAt: checkin.submitted_at,
            status: checkin.status,
          }
        : null,

      latestAssessment: assessment
        ? {
            id: assessment.id,
            priority: assessment.priority,
            triggeredRules:
              assessment.triggered_rules || [],
            recommendation:
              assessment.recommendation || null,
            createdAt: assessment.created_at,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "MOTHER DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      error: "Could not load your dashboard.",
    });
  }
}

module.exports = {
  getMotherDashboard,
};