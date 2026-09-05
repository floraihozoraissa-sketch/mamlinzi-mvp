const supabase = require("../config/supabase");
const { assessRisk } = require("../services/mrieService");

const createCheckin = async (req, res) => {
  try {
    const { data: motherProfile, error: motherError } =
  await supabase
    .from("mother_profiles")
    .select("id")
    .eq("user_id", req.user.id)
    .single();

if (motherError || !motherProfile) {
  return res.status(404).json({
    error: "Maternal profile not found."
  });
}

const motherId = motherProfile.id;

    // 1. Save the health check-in
    const { data: checkin, error: checkinError } = await supabase
      .from("health_checkins")
      .insert({
        mother_id: motherId,
        responses,
        status: "submitted"
      })
      .select()
      .single();

    if (checkinError) {
      return res.status(500).json({
        success: false,
        message: checkinError.message
      });
    }

    // 2. Run MRIE
    const assessment = assessRisk(responses);

    // 3. Save the risk assessment
    const { data: riskAssessment, error: assessmentError } =
      await supabase
        .from("risk_assessments")
        .insert({
          checkin_id: checkin.id,
          priority: assessment.priority,
          triggered_rules: assessment.triggeredRules,
          recommendation: assessment.recommendation
        })
        .select()
        .single();

    if (assessmentError) {
      return res.status(500).json({
        success: false,
        message: assessmentError.message
      });
    }

    // 4. Mark check-in as processed
    const { error: updateError } = await supabase
      .from("health_checkins")
      .update({
        status: "processed"
      })
      .eq("id", checkin.id);

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: updateError.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Health check-in processed successfully.",
      checkin: {
        ...checkin,
        status: "processed"
      },
      riskAssessment
    });

  } catch (error) {
    console.error("Check-in processing error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing the check-in."
    });
  }
};

module.exports = {
  createCheckin
};