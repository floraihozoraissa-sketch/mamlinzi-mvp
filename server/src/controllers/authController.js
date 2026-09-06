const supabase = require("../config/supabase");

async function registerMother(req, res) {
  const {
    fullName,
    email,
    phone,
    password,
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      error:
        "Full name, email, phone and password are required.",
    });
  }

  let userId = null;

  try {
    // 1. Create the Supabase Auth user
    const {
      data: authData,
      error: authError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
      });
    }

    userId = authData.user.id;

    // 2. Create the MaMlinzi profile
    const {
      error: profileError,
    } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: fullName,
        role: "mother",
        phone,
      });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);

      return res.status(400).json({
        error: profileError.message,
      });
    }

    // 3. Find an available CHW for the MVP
    const {
      data: chw,
      error: chwError,
    } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "chw")
      .limit(1)
      .maybeSingle();

    if (chwError) {
      console.error(
        "CHW LOOKUP ERROR:",
        chwError
      );

      // Roll back the profile and Auth account
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      await supabase.auth.admin.deleteUser(userId);

      return res.status(500).json({
        error:
          "Could not find an available community health worker.",
      });
    }

    // 4. Create the maternal profile
    const {
      error: motherProfileError,
    } = await supabase
      .from("mother_profiles")
      .insert({
        user_id: userId,
        assigned_chw_id: chw?.id || null,
      });

    if (motherProfileError) {
      console.error(
        "MOTHER PROFILE ERROR:",
        motherProfileError
      );

      // Roll back everything created for this user
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      await supabase.auth.admin.deleteUser(userId);

      return res.status(400).json({
        error: motherProfileError.message,
      });
    }

    // 5. Registration successful
    return res.status(201).json({
      message: "Mother registered successfully.",
      userId,
      assignedCHW: chw
        ? {
            id: chw.id,
            name: chw.full_name,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "MOTHER REGISTRATION ERROR:",
      error
    );

    // Safety rollback if Auth user was created
    if (userId) {
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      await supabase.auth.admin.deleteUser(userId);
    }

    return res.status(500).json({
      error:
        "An unexpected error occurred during registration.",
    });
  }
}

module.exports = {
  registerMother,
};