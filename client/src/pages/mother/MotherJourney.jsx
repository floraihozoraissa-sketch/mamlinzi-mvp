import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  ClipboardCheck,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import "./MotherJourney.css";

function MotherJourney() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = async () => {
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
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load your care journey."
        );
      }

      setDashboard(data);
    } catch (err) {
      console.error("MOTHER JOURNEY ERROR:", err);

      setError(
        err.message ||
          "Something went wrong while loading your journey."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-RW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mother-journey-state">
        <div className="mother-journey-loader">
          <HeartPulse size={24} />
        </div>

        <h2>Loading your journey</h2>

        <p>
          We're getting your latest care updates ready.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mother-journey-state">
        <div className="mother-journey-state-icon">
          <CircleHelp size={24} />
        </div>

        <h2>We couldn't load your journey</h2>

        <p>{error}</p>

        <button
          className="mother-journey-primary"
          onClick={loadJourney}
        >
          Try again
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const latestCheckin = dashboard?.latestCheckin;
  const latestAssessment = dashboard?.latestAssessment;
  const latestFollowup = dashboard?.latestFollowup;

  const hasCheckin = Boolean(latestCheckin);
  const informationReviewed = Boolean(latestAssessment);
  const hasFollowup = Boolean(latestFollowup);
  const followupCompleted =
    latestFollowup?.status === "completed";

  return (
    <div className="mother-journey-page">
      <header className="mother-journey-header">
        <button
          className="mother-journey-back"
          onClick={() => navigate("/mother")}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>My care journey</h1>
          <p>
            See what's happened and what comes next.
          </p>
        </div>
      </header>

      <main className="mother-journey-main">
        <section className="mother-journey-intro">
          <div className="mother-journey-intro-icon">
            <HeartPulse size={26} />
          </div>

          <div>
            <h2>Your care, step by step</h2>

            <p>
              We'll keep you updated as your
              information moves through your
              care journey.
            </p>
          </div>
        </section>

        <section className="mother-timeline">
          {/* CHECK-IN */}
          <div
            className={`mother-timeline-step ${
              hasCheckin
                ? "completed"
                : "current"
            }`}
          >
            <div className="mother-timeline-marker">
              {hasCheckin ? (
                <Check size={17} />
              ) : (
                <ClipboardCheck size={18} />
              )}
            </div>

            <div className="mother-timeline-connector" />

            <div className="mother-timeline-content">
              <span>
                {hasCheckin
                  ? "COMPLETED"
                  : "UP NEXT"}
              </span>

              <h3>Check-in submitted</h3>

              <p>
                {hasCheckin
                  ? "You shared how you're feeling."
                  : "Start a check-in to share how you're feeling."}
              </p>

              {latestCheckin?.submittedAt && (
                <small>
                  {formatDate(
                    latestCheckin.submittedAt
                  )}
                </small>
              )}

              {!hasCheckin && (
                <button
                  className="mother-journey-text-button"
                  onClick={() =>
                    navigate("/mother/checkin")
                  }
                >
                  Start check-in
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* INFORMATION REVIEW */}
          <div
            className={`mother-timeline-step ${
              informationReviewed
                ? "completed"
                : hasCheckin
                  ? "current"
                  : "upcoming"
            }`}
          >
            <div className="mother-timeline-marker">
              {informationReviewed ? (
                <Check size={17} />
              ) : (
                <ShieldCheck size={18} />
              )}
            </div>

            <div className="mother-timeline-connector" />

            <div className="mother-timeline-content">
              <span>
                {informationReviewed
                  ? "COMPLETED"
                  : hasCheckin
                    ? "IN REVIEW"
                    : "UPCOMING"}
              </span>

              <h3>Information reviewed</h3>

              <p>
                {informationReviewed
                  ? "Your information has been processed to guide appropriate follow-up."
                  : "Your shared information will be processed after your check-in."}
              </p>
            </div>
          </div>

          {/* CHW FOLLOW-UP */}
          <div
            className={`mother-timeline-step ${
              hasFollowup
                ? "completed"
                : informationReviewed
                  ? "current"
                  : "upcoming"
            }`}
          >
            <div className="mother-timeline-marker">
              {hasFollowup ? (
                <Check size={17} />
              ) : (
                <MessageCircle size={18} />
              )}
            </div>

            <div className="mother-timeline-connector" />

            <div className="mother-timeline-content">
              <span>
                {hasFollowup
                  ? "COMPLETED"
                  : informationReviewed
                    ? "FOLLOW-UP"
                    : "UPCOMING"}
              </span>

              <h3>CHW follow-up</h3>

              <p>
                {hasFollowup
                  ? "Your community health worker recorded a follow-up."
                  : "Your community health worker can follow up when needed."}
              </p>

              {latestFollowup?.createdAt && (
                <small>
                  {formatDate(
                    latestFollowup.createdAt
                  )}
                </small>
              )}
            </div>
          </div>

          {/* FOLLOW-UP COMPLETED */}
          <div
            className={`mother-timeline-step ${
              followupCompleted
                ? "completed"
                : "upcoming"
            }`}
          >
            <div className="mother-timeline-marker">
              {followupCompleted ? (
                <Check size={17} />
              ) : (
                <HeartPulse size={18} />
              )}
            </div>

            <div className="mother-timeline-content">
              <span>
                {followupCompleted
                  ? "COMPLETED"
                  : "UPCOMING"}
              </span>

              <h3>Follow-up completed</h3>

              <p>
                {followupCompleted
                  ? "Your follow-up update is available below."
                  : "Your follow-up update will appear here once completed."}
              </p>
            </div>
          </div>
        </section>

        {/* FOLLOW-UP RESULTS */}
        {followupCompleted && (
          <section className="mother-journey-results">
            <div className="mother-results-heading">
              <div>
                <span>YOUR LATEST UPDATE</span>
                <h2>Follow-up details</h2>
              </div>

              <div className="mother-results-check">
                <Check size={18} />
              </div>
            </div>

            {latestFollowup?.notes && (
              <div className="mother-result-card">
                <div className="mother-result-icon">
                  <MessageCircle size={20} />
                </div>

                <div>
                  <span>FOLLOW-UP UPDATE</span>
                  <p>{latestFollowup.notes}</p>
                </div>
              </div>
            )}

            {latestFollowup?.action && (
              <div className="mother-result-card">
                <div className="mother-result-icon">
                  <ArrowRight size={20} />
                </div>

                <div>
                  <span>RECOMMENDED NEXT STEP</span>
                  <p>{latestFollowup.action}</p>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="mother-journey-help">
          <div className="mother-help-icon">
            <CircleHelp size={21} />
          </div>

          <div>
            <h3>Need support?</h3>

            <p>
              If you have questions or need help,
              you can reach out through MaMlinzi.
            </p>

            <button
              onClick={() =>
                navigate("/mother/help")
              }
            >
              Get help
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <nav className="mother-journey-nav">
        <button onClick={() => navigate("/mother")}>
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

        <button className="active">
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

export default MotherJourney;