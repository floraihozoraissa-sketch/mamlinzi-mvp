import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./MotherDashboard.css";

function MotherDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [motherProfile, setMotherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/mother/login");
          return;
        }

        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, full_name, role, phone")
            .eq("id", user.id)
            .single();

        if (
          profileError ||
          profileData?.role !== "mother"
        ) {
          await supabase.auth.signOut();
          navigate("/mother/login");
          return;
        }

        const {
          data: maternalData,
          error: maternalError,
        } = await supabase
          .from("mother_profiles")
          .select(
            "id, pregnancy_start_date, assigned_chw_id"
          )
          .eq("user_id", user.id)
          .single();

        if (!maternalError) {
          setMotherProfile(maternalData);
        }

        setProfile(profileData);
      } catch (error) {
        console.error(
          "MOTHER DASHBOARD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/mother/login");
  };

  if (loading) {
    return (
      <div className="mother-loading">
        <div className="loading-mark">M</div>
        <p>Loading your MaMlinzi account...</p>
      </div>
    );
  }

  return (
    <div className="mother-dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <header className="mother-topbar">

        <div className="mother-brand">
          <div className="brand-mark">
            M
          </div>

          <div>
            <strong>MaMlinzi</strong>
            <span>Maternal care companion</span>
          </div>
        </div>

        <div className="mother-user-area">

          <div className="mother-user-avatar">
            {profile?.full_name
              ?.charAt(0)
              .toUpperCase() || "M"}
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="mother-main">

        {/* Welcome */}

        <section className="welcome-section">

          <div>
            <p className="welcome-label">
              YOUR MATERNAL CARE JOURNEY
            </p>

            <h1>
              Hello, {profile?.full_name?.split(" ")[0] || "there"} 👋
            </h1>

            <p className="welcome-text">
              MaMlinzi is here to help you stay
              connected with your maternal healthcare
              journey.
            </p>
          </div>

        </section>

        {/* =========================
            PRIMARY ACTION
        ========================= */}

        <section className="checkin-card">

          <div className="checkin-illustration">
            ♡
          </div>

          <div className="checkin-content">

            <p className="card-eyebrow">
              HOW ARE YOU FEELING?
            </p>

            <h2>
              Take a health check-in
            </h2>

            <p>
              Share how you are feeling today.
              MaMlinzi will help organize the
              information for appropriate follow-up.
            </p>

            <button
              className="checkin-button"
              onClick={() =>
                navigate("/mother/checkin")
              }
            >
              Start health check-in
              <span>→</span>
            </button>

          </div>

        </section>

        {/* =========================
            JOURNEY STATUS
        ========================= */}

        <section className="journey-section">

          <div className="section-header">
            <div>
              <p className="section-label">
                YOUR JOURNEY
              </p>

              <h2>
                Maternal care at a glance
              </h2>
            </div>
          </div>

          <div className="journey-grid">

            <div className="journey-card">

              <div className="journey-icon purple">
                ♡
              </div>

              <div>
                <span>Pregnancy profile</span>

                <strong>
                  {motherProfile
                    ? "Set up"
                    : "Not available"}
                </strong>
              </div>

            </div>

            <div className="journey-card">

              <div className="journey-icon teal">
                ✓
              </div>

              <div>
                <span>Health check-ins</span>

                <strong>
                  Ready
                </strong>
              </div>

            </div>

            <div className="journey-card">

              <div className="journey-icon purple">
                +
              </div>

              <div>
                <span>Care support</span>

                <strong>
                  MaMlinzi is here
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            SUPPORT MESSAGE
        ========================= */}

        <section className="support-card">

          <div className="support-icon">
            ?
          </div>

          <div>
            <h3>
              Need support?
            </h3>

            <p>
              If you are concerned about how you
              are feeling, use your available
              healthcare services or speak with
              an appropriate healthcare professional.
            </p>
          </div>

        </section>

        {/* =========================
            RESPONSIBLE AI
        ========================= */}

        <p className="mother-ai-note">
          MaMlinzi provides supportive information
          and helps connect you with care. It does
          not replace advice or decisions from
          healthcare professionals.
        </p>

      </main>

    </div>
  );
}

export default MotherDashboard;