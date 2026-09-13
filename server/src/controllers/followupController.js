const supabase = require("../config/supabase");

async function createFollowup(req, res) {
  const {
    motherId,
    assessmentId,
    action,
    status,
    notes
  } = req.body;

  if (!motherId || !action) {
    return res.status(400).json({
      error: "Mother and action are required."
    });
  }

  try {
    // IMPORTANT: derive CHW identity from the authenticated user
    const chwId = req.user.id;

    const { data: mother, error: motherError } = await supabase
      .from("mother_profiles")
      .select("id")
      .eq("id", motherId)
      .eq("assigned_chw_id", chwId)
      .maybeSingle();

    if (motherError) {
      console.error("FOLLOW-UP MOTHER LOOKUP ERROR:", motherError);
      return res.status(500).json({ error: "Could not verify the assigned mother." });
    }

    if (!mother) {
      return res.status(403).json({ error: "This mother is not assigned to you." });
    }

    if (assessmentId) {
      const { data: assessment, error: assessmentError } = await supabase
        .from("risk_assessments")
        .select("id, health_checkins!inner(mother_id)")
        .eq("id", assessmentId)
        .eq("health_checkins.mother_id", motherId)
        .maybeSingle();

      if (assessmentError) {
        console.error("FOLLOW-UP ASSESSMENT LOOKUP ERROR:", assessmentError);
        return res.status(500).json({ error: "Could not verify the case assessment." });
      }

      if (!assessment) {
        return res.status(400).json({ error: "The assessment does not belong to this mother." });
      }
    }

    const { data, error } = await supabase
      .from("followups")
      .insert({
        mother_id: motherId,
        chw_id: chwId,
        assessment_id: assessmentId || null,
        action,
        status: status || "completed",
        notes: notes || null
      })
      .select()
      .single();

    if (error) {
      console.error("FOLLOW-UP DATABASE ERROR:", error);

      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(201).json({
      message: "Follow-up recorded successfully.",
      followup: data
    });

  } catch (error) {
    console.error("FOLLOW-UP ERROR:", error);

    return res.status(500).json({
      error: "An unexpected error occurred while recording the follow-up."
    });
  }
}

module.exports = {
  createFollowup
};
