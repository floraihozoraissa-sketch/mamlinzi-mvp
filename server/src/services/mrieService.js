function assessRisk(responses) {
  const triggeredRules = [];

  /*
   * DEMO MRIE RULES
   * These are synthetic rules for MVP development.
   * They are NOT a clinical diagnosis or validated protocol.
   */

  if (responses.bleeding === true) {
    triggeredRules.push({
      rule: "BLEEDING_REPORTED",
      reason: "Bleeding was reported during the check-in."
    });
  }

  if (responses.difficulty_breathing === true) {
    triggeredRules.push({
      rule: "BREATHING_DIFFICULTY_REPORTED",
      reason: "Difficulty breathing was reported."
    });
  }

  if (responses.severe_headache === true) {
    triggeredRules.push({
      rule: "SEVERE_HEADACHE_REPORTED",
      reason: "Severe headache was reported."
    });
  }

  if (responses.feeling_unwell === true) {
    triggeredRules.push({
      rule: "FEELING_UNWELL",
      reason: "The mother reported feeling unwell."
    });
  }

  let priority = "low";
  let recommendation =
    "No demo priority rule was triggered. Continue routine follow-up.";

  /*
   * DEMO PRIORITIZATION LOGIC
   */

  const urgentDemoRules = triggeredRules.filter((rule) =>
    [
      "BLEEDING_REPORTED",
      "BREATHING_DIFFICULTY_REPORTED"
    ].includes(rule.rule)
  );

  if (urgentDemoRules.length > 0) {
    priority = "high";

    recommendation =
      "Prompt review by an appropriate healthcare professional is recommended based on the reported symptoms.";
  } else if (triggeredRules.length > 0) {
    priority = "medium";

    recommendation =
      "Follow up with the mother and consider review by an appropriate healthcare professional.";
  }

  return {
    priority,
    triggeredRules,
    recommendation
  };
}

module.exports = {
  assessRisk
};