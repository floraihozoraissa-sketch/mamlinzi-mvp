require("dotenv").config();

const chwRoutes = require("./routes/chwRoutes");
const followupRoutes = require("./routes/followupRoutes");
const checkinRoutes = require("./routes/checkinRoutes");
const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabase");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/chw", chwRoutes);
app.use("/api/followups", followupRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "MaMlinzi API is running",
    status: "healthy",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "MaMlinzi is connected to Supabase.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`MaMlinzi API running on port ${PORT}`);
});