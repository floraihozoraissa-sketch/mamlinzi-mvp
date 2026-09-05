const supabase = require("../config/supabase");

async function getOverview(req, res) {
  try {
    // 1. Total mothers
    const { count: totalMothers, error: mothersError } =
      await supabase
        .from("mother_profiles")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (mothersError) throw mothersError;

    // 2. Total health check-ins
    const { count: totalCheckins, error: checkinsError } =
      await supabase
        .from("health_checkins")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (checkinsError) throw checkinsError;

    // 3. Risk assessments
    const {
      data: assessments,
      error: assessmentsError,
    } = await supabase
      .from("risk_assessments")
      .select(
        "id, priority, triggered_rules, recommendation, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (assessmentsError) throw assessmentsError;

    // 4. Follow-ups
    const {
      data: followups,
      error: followupsError,
    } = await supabase
      .from("followups")
      .select(
        "id, status, action, notes, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (followupsError) throw followupsError;

    // 5. Calculate risk distribution
    const priorityDistribution = {
      high: 0,
      medium: 0,
      low: 0,
    };

    assessments.forEach((assessment) => {
      if (
        priorityDistribution[
          assessment.priority
        ] !== undefined
      ) {
        priorityDistribution[
          assessment.priority
        ]++;
      }
    });

    // 6. Follow-up statistics
    const completedFollowups =
      followups.filter(
        (item) => item.status === "completed"
      ).length;

    const pendingFollowups =
      followups.filter(
        (item) => item.status === "pending"
      ).length;

    // 7. Recent assessments
    const recentAssessments =
      assessments.slice(0, 5);

    // 8. Recent follow-ups
    const recentFollowups =
      followups.slice(0, 5);

    return res.json({
      summary: {
        totalMothers: totalMothers || 0,
        totalCheckins: totalCheckins || 0,
        highPriority:
          priorityDistribution.high,
        completedFollowups,
        pendingFollowups,
      },

      priorityDistribution,

      recentAssessments,

      recentFollowups,
    });

  } catch (error) {
    console.error(
      "INTELLIGENCE OVERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      error:
        "Could not load Intelligence Hub data.",
    });
  }
}

module.exports = {
  getOverview,
};