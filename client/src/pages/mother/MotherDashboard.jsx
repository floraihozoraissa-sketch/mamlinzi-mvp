import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleHelp,
  ClipboardCheck,
  HeartPulse,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import "./MotherDashboard.css";
import MamlinziLogo from "@/components/MaMlinziLogo";

function MotherDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/mother/login");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/mother/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load your dashboard."
        );
      }

      setDashboard(data);
    } catch (err) {
      console.error("MOTHER DASHBOARD ERROR:", err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/mother/login");
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-RW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFirstName = (fullName) => {
    if (!fullName) return "there";

    return fullName.trim().split(" ")[0];
  };

  if (loading) {
    return (
      <div className="mother-page-state">
        <div className="mother-loader">
          <HeartPulse size={24} />
        </div>

        <h2>Getting things ready</h2>

        <p>
          Loading your MaMlinzi support...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mother-page-state">
        <div className="mother-state-icon">
          <CircleHelp size={24} />
        </div>

        <h2>
          We couldn't load your dashboard
        </h2>

        <p>{error}</p>

        <button
          className="mother-primary-button"
          onClick={loadDashboard}
        >
          Try again
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const profile = dashboard?.profile;
  const latestCheckin = dashboard?.latestCheckin;
  const latestAssessment = dashboard?.latestAssessment;

  const hasCheckin = Boolean(latestCheckin);
  const latestFollowup =
    dashboard?.latestFollowup || null;
const informationReviewed = Boolean(latestAssessment);
const followupCompleted =
  latestFollowup?.status === "completed";

  /*
    This is intentionally ready for the follow-up
    data we will add to the backend next.

    Until then, the dashboard safely falls back
    to the current assessment state.
  */
  

  return (
    <div className="mother-dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <header className="mother-header">

        <div className="mother-brand">
          <MamlinziLogo/>

          <div className="mother-brand-copy">
            <h1>MaMlinzi</h1>
            <span>Maternal care companion</span>
          </div>
        </div>

        <div className="mother-header-actions">

          <div className="mother-user">

            <div className="mother-avatar">
              {profile?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "M"}
            </div>

            <div className="mother-user-copy">
              <strong>
                {profile?.fullName || "Mother"}
              </strong>

              <span>Mother</span>
            </div>

          </div>

          <button
            className="mother-signout"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="mother-main">

        {/* =========================
            WELCOME
        ========================= */}

        <section className="mother-welcome">

          <div>
            <p className="mother-eyebrow">
              YOUR MATERNAL JOURNEY
            </p>

            <h2>
              Hello,{" "}
              {getFirstName(profile?.fullName)} 👋
            </h2>

            <p className="mother-welcome-text">
              We're here to help you stay informed,
              connected, and supported throughout
              your pregnancy.
            </p>
          </div>

        </section>

        {/* =========================
            PRIMARY CHECK-IN
        ========================= */}

        <section className="mother-checkin-card">

          <div className="mother-checkin-icon">
            <ClipboardCheck size={30} />
          </div>

          <div className="mother-checkin-content">

            <p className="mother-card-label">
              TODAY'S CHECK-IN
            </p>

            <h3>
              How are you feeling today?
            </h3>

            <p>
              Take a moment to share how you're
              feeling. It only takes a few minutes.
            </p>

            <button
              className="mother-primary-button"
              onClick={() =>
                navigate("/mother/checkin")
              }
            >
              Start check-in
              <ArrowRight size={18} />
            </button>

          </div>

        </section>

        {/* =========================
            LATEST UPDATE
        ========================= */}

        <section className="mother-section">

          <div className="mother-section-heading">

            <div>
              <p className="mother-eyebrow">
                LATEST UPDATE
              </p>

              <h3>
                Your check-in
              </h3>
            </div>

            {latestCheckin && (
              <span className="mother-date">
                {formatDate(
                  latestCheckin.submittedAt
                )}
              </span>
            )}

          </div>

          {!hasCheckin ? (

            <div className="mother-update-card mother-update-empty">

              <div className="mother-update-icon">
                <ClipboardCheck size={22} />
              </div>

              <div className="mother-update-content">

                <h4>
                  Your first check-in is waiting
                </h4>

                <p>
                  Share how you're feeling to
                  start your MaMlinzi journey.
                </p>

                <button
                  className="mother-text-button"
                  onClick={() =>
                    navigate("/mother/checkin")
                  }
                >
                  Complete check-in
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          ) : (

            <div className="mother-update-card">

              {/* Completed check-in */}

              <div className="mother-update-header">

                <div className="mother-status-icon">
                  <Check size={20} />
                </div>

                <div>
                  <h4>
                    Check-in completed
                  </h4>

                  <p>
                    Your information has been
                    received and reviewed.
                  </p>
                </div>

              </div>

              {/* Follow-up */}
<div className="mother-followup">
  <div className="mother-followup-heading">
    <span>FOLLOW-UP UPDATE</span>
  </div>

  {followupCompleted ? (
    <div className="mother-followup-completed">
      <div className="mother-followup-status">
        <div className="mother-followup-status-icon">
          <Check size={18} />
        </div>

        <div>
          <strong>Follow-up completed</strong>

          <p>
            Your community health worker has
            completed your follow-up.
          </p>

          {latestFollowup?.createdAt && (
            <small>
              {formatDate(latestFollowup.createdAt)}
            </small>
          )}
        </div>
      </div>

      {latestFollowup?.notes && (
        <div className="mother-followup-detail">
          <span>FOLLOW-UP UPDATE</span>

          <p>{latestFollowup.notes}</p>
        </div>
      )}

      {latestFollowup?.action && (
        <div className="mother-followup-detail">
          <span>RECOMMENDED NEXT STEP</span>

          <p>{latestFollowup.action}</p>
        </div>
      )}
    </div>
  ) : (
    <div className="mother-followup-status pending">
      <div className="mother-followup-status-icon">
        <MessageCircle size={18} />
      </div>

      <div>
        <strong>Your care team may follow up</strong>

        <p>
          If follow-up is needed, your community
          health worker will contact you.
        </p>
      </div>
    </div>
  )}
</div>

              {/* Journey button */}

              <button
                className="mother-outline-button"
                onClick={() =>
                  navigate("/mother/journey")
                }
              >
                View my care journey
                <ArrowRight size={17} />
              </button>

            </div>

          )}

        </section>

        {/* =========================
            CARE JOURNEY
        ========================= */}

        <section className="mother-section">

          <div className="mother-section-heading">

            <div>
              <p className="mother-eyebrow">
                YOUR JOURNEY
              </p>

              <h3>
                Care, step by step
              </h3>
            </div>

          </div>

          <div className="mother-care-journey">

            <div className="mother-journey-step completed">

              <div className="mother-journey-marker">
                <Check size={17} />
              </div>

              <div className="mother-journey-line"></div>

              <div className="mother-journey-content">

                <span>
                  COMPLETED
                </span>

                <h4>
                  Check-in submitted
                </h4>

                <p>
                  You shared how you're feeling.
                </p>

              </div>

            </div>

            <div
              className={`mother-journey-step ${
  informationReviewed
    ? "completed"
    : hasCheckin
      ? "current"
      : "upcoming"
}`}
            >

              <div className="mother-journey-marker">

                {informationReviewed ? (
  <Check size={17} />
) : (
  <ShieldCheck size={17} />
)}

              </div>

              <div className="mother-journey-line"></div>

              <div className="mother-journey-content">

                <span>
                  {hasCheckin
                    ? "COMPLETED"
                    : "UP NEXT"}
                </span>

                <h4>
                  Information reviewed
                </h4>

                <p>
                  Your shared information is
                  reviewed to guide appropriate
                  follow-up.
                </p>

              </div>

            </div>

            <div
              className={`mother-journey-step ${
                followupCompleted
                  ? "completed"
                  : hasCheckin
                    ? "current"
                    : "upcoming"
              }`}
            >

              <div className="mother-journey-marker">

                {followupCompleted ? (
                  <Check size={17} />
                ) : (
                  <MessageCircle size={17} />
                )}

              </div>

              <div className="mother-journey-line"></div>

              <div className="mother-journey-content">

                <span>
                  {followupCompleted
                    ? "COMPLETED"
                    : "FOLLOW-UP"}
                </span>

                <h4>
                  CHW follow-up
                </h4>

                <p>
                  Your community health worker
                  can follow up when needed.
                </p>

              </div>

            </div>

            <div
              className={`mother-journey-step ${
                followupCompleted
                  ? "completed"
                  : "upcoming"
              }`}
            >

              <div className="mother-journey-marker">

                {followupCompleted ? (
                  <Check size={17} />
                ) : (
                  <HeartPulse size={17} />
                )}

              </div>

              <div className="mother-journey-content">

                <span>
                  {followupCompleted
                    ? "COMPLETED"
                    : "UPCOMING"}
                </span>

                <h4>
                  Follow-up completed
                </h4>

                <p>
                  View your follow-up update
                  and recommended next step.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            SUPPORT
        ========================= */}

        <section className="mother-support-card">

          <div className="mother-support-icon">
            <CircleHelp size={21} />
          </div>

          <div>

            <h3>
              Need support?
            </h3>

            <p>
              MaMlinzi helps keep you connected
              with appropriate care support
              throughout your maternal journey.
            </p>

            <button
              className="mother-text-button"
              onClick={() =>
                navigate("/mother/help")
              }
            >
              Get help
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

        {/* =========================
            RESPONSIBLE AI
        ========================= */}

        <section className="mother-ai-note">

          <ShieldCheck size={19} />

          <div>

            <strong>
              Your information matters
            </strong>

            <p>
              MaMlinzi uses the information you
              share to support follow-up decisions.
              It does not replace a healthcare
              professional or provide a medical
              diagnosis.
            </p>

          </div>

        </section>

      </main>

      {/* =========================
          MOBILE NAV
      ========================= */}

      <nav className="mother-mobile-nav">

        <button
          className="active"
          onClick={() => navigate("/mother")}
        >
          <HeartPulse size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() =>
            navigate("/mother/checkin")
          }
        >
          <ClipboardCheck size={20} />
          <span>Check-in</span>
        </button>

        <button
          onClick={() =>
            navigate("/mother/journey")
          }
        >
          <ShieldCheck size={20} />
          <span>My journey</span>
        </button>

        <button
          onClick={() =>
            navigate("/mother/help")
          }
        >
          <CircleHelp size={20} />
          <span>Help</span>
        </button>

      </nav>
    </div>
  );
}

export default MotherDashboard;