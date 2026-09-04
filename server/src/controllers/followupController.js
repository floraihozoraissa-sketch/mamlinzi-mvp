const supabase = require("../config/supabase");

const createFollowup = async (req, res) => {
  try {
    const {
      motherId,
      chwId,
      assessmentId,
      action,
      status,
      notes,
    } = req.body;

    if (!motherId || !chwId || !action) {
      return res.status(400).json({
        success: false,
        message: "Mother ID, CHW ID, and action are required.",
      });
    }

    const { data, error } = await supabase
      .from("followups")
      .insert({
        mother_id: motherId,
        chw_id: chwId,
        assessment_id: assessmentId || null,
        action,
        status: status || "pending",
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Follow-up recorded successfully.",
      followup: data,
    });
  } catch (error) {
    console.error("Follow-up error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to record follow-up.",
    });
  }
};

module.exports = {
  createFollowup,
};