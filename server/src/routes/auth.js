const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password
  } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      error: "Full name, email, phone and password are required."
    });
  }

  try {
    // 1. Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (authError) {
      return res.status(400).json({
        error: authError.message
      });
    }

    const userId = authData.user.id;

    // 2. Create MaMlinzi profile
    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: fullName,
          role: "mother",
          phone
        });

    if (profileError) {
      // Clean up Auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId);

      return res.status(400).json({
        error: profileError.message
      });
    }

    // 3. Create mother profile
    const { error: motherProfileError } =
      await supabase
        .from("mother_profiles")
        .insert({
          user_id: userId
        });

    if (motherProfileError) {
      // Clean up profile and Auth user
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      await supabase.auth.admin.deleteUser(userId);

      return res.status(400).json({
        error: motherProfileError.message
      });
    }

    return res.status(201).json({
      message: "Mother registered successfully.",
      userId
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred during registration."
    });
  }
});

module.exports = router;