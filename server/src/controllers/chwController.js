const supabase = require("../config/supabase");

const getPriorityCases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("risk_assessments")
      .select(`
        id,
        priority,
        triggered_rules,
        recommendation,
        created_at,
        health_checkins (
          id,
          submitted_at,
          mother_profiles (
            id,
            user_id,
            profiles!mother_profiles_user_id_fkey (
              full_name,
              phone
            )
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      cases: data,
    });
  } catch (error) {
    console.error("CHW cases error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve priority cases.",
    });
  }
};

module.exports = {
  getPriorityCases,
};