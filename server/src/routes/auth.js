const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;

    // Validate required fields
    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, and password are required.",
      });
    }

    // Create account using Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        password,
        phone,
        phone_confirm: true,
      });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    const userId = authData.user.id;

    // Create the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: fullName,
        role: "mother",
        phone,
      })
      .select()
      .single();

    if (profileError) {
      // Clean up Auth account if profile creation fails
      await supabase.auth.admin.deleteUser(userId);

      return res.status(500).json({
        success: false,
        message: profileError.message,
      });
    }

    // Create mother-specific profile
    const { data: motherProfile, error: motherError } = await supabase
      .from("mother_profiles")
      .insert({
        user_id: userId,
      })
      .select()
      .single();

    if (motherError) {
      // Clean up records if mother profile creation fails
      await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.admin.deleteUser(userId);

      return res.status(500).json({
        success: false,
        message: motherError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Mother registered successfully.",
      user: profile,
      motherProfile,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
    });
  }
});

module.exports = router;