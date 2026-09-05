const supabase = require("../config/supabase");
const { assessRisk } = require("../services/mrieService");

async function createCheckin(req, res) {
  const { responses } = req.body;

  if (!responses) {
    return res.status(400).json({
      error: "Check-in responses are required.",
    });
  }

  try {
    // Get the maternal profile belonging to the authenticated user.
    const { data: motherProfile, error: motherError } =
      await supabase
        .from("mother_profiles")
        .select("id")
        .eq("user_id", req.user.id)
        .single();

    if (motherError || !motherProfile) {
      console.error("MOTHER PROFILE ERROR:", motherError);

      return res.status(404).json({
        error: "Maternal profile not found.",
      });
    }

    const motherId = motherProfile.id;

    // Save the health check-in.
    const { data: checkin, error: checkinError } =
      await supabase
        .from("health_checkins")
        .insert({
          mother_id: motherId,
          responses,
          status: "submitted",
        })
        .select()
        .single();

    if (checkinError) {
      console.error("CHECK-IN DATABASE ERROR:", checkinError);

      return res.status(400).json({
        error: checkinError.message,
      });
    }

    // Process the responses through MRIE.
    const riskAssessment = assessRisk(responses);

    // Save the risk assessment.
    const { data: assessment, error: assessmentError } =
      await supabase
        .from("risk_assessments")
        .insert({
          checkin_id: checkin.id,
          priority: riskAssessment.priority,
          triggered_rules: riskAssessment.triggeredRules,
          recommendation: riskAssessment.recommendation,
        })
        .select()
        .single();

    if (assessmentError) {
      console.error(
        "RISK ASSESSMENT DATABASE ERROR:",
        assessmentError
      );

      return res.status(400).json({
        error: assessmentError.message,
      });
    }

    // Mark the check-in as processed.
    const { error: updateError } =
      await supabase
        .from("health_checkins")
        .update({
          status: "processed",
        })
        .eq("id", checkin.id);

    if (updateError) {
      console.error(
        "CHECK-IN STATUS UPDATE ERROR:",
        updateError
      );
    }

    return res.status(201).json({
      message: "Check-in processed successfully.",
      checkin,
      riskAssessment: assessment,
    });
  } catch (error) {
    console.error("Check-in processing error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred while processing the check-in.",
    });
  }
}

module.exports = {
  createCheckin,
};