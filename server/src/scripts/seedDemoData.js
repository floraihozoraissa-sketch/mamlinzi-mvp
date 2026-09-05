const supabase = require("../config/supabase");

const demoMothers = [
  {
    name: "Aline Mukamana",
    phone: "+250780100001",
    priority: "high",
    responses: {
      bleeding: true,
      difficulty_breathing: false,
      severe_headache: false,
      feeling_unwell: false,
    },
    action: "Follow-up initiated",
    followupStatus: "completed",
  },

  {
    name: "Beatrice Uwase",
    phone: "+250780100002",
    priority: "medium",
    responses: {
      bleeding: false,
      difficulty_breathing: false,
      severe_headache: true,
      feeling_unwell: false,
    },
    action: "Mother contacted",
    followupStatus: "completed",
  },

  {
    name: "Grace Mwangi",
    phone: "+250780100003",
    priority: "low",
    responses: {
      bleeding: false,
      difficulty_breathing: false,
      severe_headache: false,
      feeling_unwell: false,
    },
    action: null,
    followupStatus: null,
  },

  {
    name: "Amina Diallo",
    phone: "+250780100004",
    priority: "high",
    responses: {
      bleeding: false,
      difficulty_breathing: true,
      severe_headache: false,
      feeling_unwell: false,
    },
    action: "Referred for professional review",
    followupStatus: "pending",
  },

  {
    name: "Sofia Reyes",
    phone: "+250780100005",
    priority: "medium",
    responses: {
      bleeding: false,
      difficulty_breathing: false,
      severe_headache: false,
      feeling_unwell: true,
    },
    action: "Follow-up initiated",
    followupStatus: "completed",
  },

  {
    name: "Claudine Ingabire",
    phone: "+250780100006",
    priority: "low",
    responses: {
      bleeding: false,
      difficulty_breathing: false,
      severe_headache: false,
      feeling_unwell: false,
    },
    action: null,
    followupStatus: null,
  },

  {
    name: "Diane Uwamahoro",
    phone: "+250780100007",
    priority: "medium",
    responses: {
      bleeding: false,
      difficulty_breathing: false,
      severe_headache: true,
      feeling_unwell: false,
    },
    action: "Mother contacted",
    followupStatus: "pending",
  },

  {
    name: "Esther Niyonsenga",
    phone: "+250780100008",
    priority: "high",
    responses: {
      bleeding: true,
      difficulty_breathing: false,
      severe_headache: false,
      feeling_unwell: false,
    },
    action: "Referred for professional review",
    followupStatus: "completed",
  },
];

async function createDemoMother(mother, index, chwId) {
  const email =
    `demo.mother.${index + 1}@mamlinzi.test`;

  const password =
    `DemoMother${index + 1}Temp!2026`;

  console.log(`Creating ${mother.name}...`);

  // Create authentication user
  const {
    data: authData,
    error: authError,
  } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    console.log(
      `Skipping ${mother.name}: ${authError.message}`
    );
    return;
  }

  const userId = authData.user.id;

  // Create profile
  const {
    error: profileError
  } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: mother.name,
      role: "mother",
      phone: mother.phone,
    });

  if (profileError) {
    throw profileError;
  }

  // Create maternal profile
  const {
    data: motherProfile,
    error: motherProfileError
  } = await supabase
    .from("mother_profiles")
    .insert({
      user_id: userId,
      assigned_chw_id: chwId,
    })
    .select()
    .single();

  if (motherProfileError) {
    throw motherProfileError;
  }

  // Create check-in
  const {
    data: checkin,
    error: checkinError
  } = await supabase
    .from("health_checkins")
    .insert({
      mother_id: motherProfile.id,
      responses: mother.responses,
      status: "processed",
    })
    .select()
    .single();

  if (checkinError) {
    throw checkinError;
  }

  // Create risk assessment
  let triggeredRules = [];
  let recommendation =
    "No demo priority rule was triggered. Continue routine follow-up.";

  if (mother.responses.bleeding) {
    triggeredRules.push({
      rule: "BLEEDING_REPORTED",
      reason:
        "Bleeding was reported during the check-in.",
    });
  }

  if (mother.responses.difficulty_breathing) {
    triggeredRules.push({
      rule: "BREATHING_DIFFICULTY_REPORTED",
      reason:
        "Difficulty breathing was reported.",
    });
  }

  if (mother.responses.severe_headache) {
    triggeredRules.push({
      rule: "SEVERE_HEADACHE_REPORTED",
      reason:
        "Severe headache was reported.",
    });
  }

  if (mother.responses.feeling_unwell) {
    triggeredRules.push({
      rule: "FEELING_UNWELL",
      reason:
        "The mother reported feeling unwell.",
    });
  }

  if (mother.priority === "high") {
    recommendation =
      "Prompt review by an appropriate healthcare professional is recommended based on the reported symptoms.";
  } else if (mother.priority === "medium") {
    recommendation =
      "Follow up with the mother and consider review by an appropriate healthcare professional.";
  }

  const {
    data: assessment,
    error: assessmentError
  } = await supabase
    .from("risk_assessments")
    .insert({
      checkin_id: checkin.id,
      priority: mother.priority,
      triggered_rules: triggeredRules,
      recommendation,
    })
    .select()
    .single();

  if (assessmentError) {
    throw assessmentError;
  }

  // Create follow-up where applicable
  if (mother.action) {
    const {
      error: followupError
    } = await supabase
      .from("followups")
      .insert({
        mother_id: motherProfile.id,
        chw_id: chwId,
        assessment_id: assessment.id,
        action: mother.action,
        status: mother.followupStatus,
        notes:
          "Synthetic demo follow-up for MVP testing.",
      });

    if (followupError) {
      throw followupError;
    }
  }

  console.log(
    `✓ ${mother.name} created successfully`
  );
}

async function seedDemoData() {
  try {
    // Find an existing CHW
    const {
      data: chw,
      error: chwError
    } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "chw")
      .limit(1)
      .single();

    if (chwError || !chw) {
      throw new Error(
        "No CHW account found. Create the demo CHW account first."
      );
    }

    console.log(
      `Using CHW: ${chw.full_name}`
    );

    for (
      let i = 0;
      i < demoMothers.length;
      i++
    ) {
      await createDemoMother(
        demoMothers[i],
        i,
        chw.id
      );
    }

    console.log("\n================================");
    console.log("Demo data seeded successfully!");
    console.log("================================");

  } catch (error) {
    console.error(
      "\nDEMO SEED ERROR:",
      error
    );

    process.exit(1);
  }
}

seedDemoData();