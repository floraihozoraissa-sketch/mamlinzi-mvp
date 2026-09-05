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