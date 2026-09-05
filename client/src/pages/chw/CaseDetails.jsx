import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import "./CaseDetails.css";

function CaseDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const caseItem = location.state?.caseItem;

  const [action, setAction] = useState("Follow-up initiated");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  if (!caseItem) {
    return (
      <div className="case-page">
        <div className="case-not-found">
          <div className="not-found-icon">!</div>

          <h1>Case not found</h1>

          <p>
            We couldn't find the case information you were trying to open.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/chw")}
          >
            ← Back to cases
          </button>
        </div>
      </div>
    );
  }

  const mother =
    caseItem.health_checkins?.mother_profiles?.profiles;

  const motherProfile =
    caseItem.health_checkins?.mother_profiles;

  const motherId = motherProfile?.id;
  const assessmentId = caseItem.id;

  const priority = caseItem.priority?.toLowerCase();

  const priorityLabel =
    priority === "high"
      ? "High priority"
      : priority === "medium"
      ? "Medium priority"
      : "Low priority";

  const priorityDescription =
    priority === "high"
      ? "This case requires prompt attention."
      : priority === "medium"
      ? "This case may require follow-up."
      : "Continue routine follow-up.";

  const getInitials = (name) => {
    if (!name) return "M";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleFollowup = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!motherId || !assessmentId) {
        setMessage("Required case information is missing.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/chw/login");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/followups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            motherId,
            assessmentId,
            action,
            status: "completed",
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("FOLLOW-UP API ERROR:", data);

        throw new Error(
          data.error || "Failed to record follow-up."
        );
      }

      console.log("FOLLOW-UP SUCCESS:", data);

      setMessage("Follow-up recorded successfully.");
      setNotes("");
    } catch (error) {
      console.error("FOLLOW-UP ERROR:", error);

      setMessage(
        error.message || "Failed to record follow-up."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="case-page">
      {/* Top bar */}
      <header className="case-header">
        <div className="case-header-left">
          <button
            className="back-button"
            onClick={() => navigate("/chw")}
          >
            ←
          </button>

          <div>
            <p className="breadcrumb">
              CHW workspace / Priority cases
            </p>

            <h1>Case details</h1>
          </div>
        </div>

        <div className="case-header-status">
          <span className="status-dot"></span>
          CHW workspace
        </div>
      </header>

      <main className="case-content">
        {/* Mother profile */}
        <section className="mother-card">
          <div className="mother-avatar">
            {getInitials(mother?.full_name)}
          </div>

          <div className="mother-info">
            <p className="section-eyebrow">
              Mother
            </p>

            <h2>
              {mother?.full_name || "Unknown mother"}
            </h2>

            <p className="mother-phone">
              {mother?.phone || "Phone not available"}
            </p>
          </div>

          <div className={`priority-badge ${priority}`}>
            <span className="priority-dot"></span>
            {priorityLabel}
          </div>
        </section>

        {/* Priority overview */}
        <section className={`priority-banner ${priority}`}>
          <div className="priority-banner-icon">
            {priority === "high"
              ? "!"
              : priority === "medium"
              ? "!"
              : "✓"}
          </div>

          <div>
            <h3>{priorityLabel}</h3>

            <p>{priorityDescription}</p>
          </div>
        </section>

        {/* Main grid */}
        <div className="case-grid">
          <div className="case-main-column">
            {/* Why prioritized */}
            <section className="case-card">
              <div className="card-heading">
                <div className="heading-icon purple">
                  ?
                </div>

                <div>
                  <h2>Why was this case prioritized?</h2>
                  <p>
                    Information reported during the mother's
                    health check-in.
                  </p>
                </div>
              </div>

              <div className="reason-list">
                {caseItem.triggered_rules?.length > 0 ? (
                  caseItem.triggered_rules.map(
                    (rule, index) => (
                      <div
                        className="reason-item"
                        key={index}
                      >
                        <div className="reason-number">
                          {index + 1}
                        </div>

                        <div>
                          <strong>
                            Reported concern
                          </strong>

                          <p>{rule.reason}</p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="empty-reasons">
                    <span>✓</span>

                    <p>
                      No priority rules were triggered
                      during this check-in.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Recommendation */}
            <section className="case-card recommendation-card">
              <div className="card-heading">
                <div className="heading-icon teal">
                  ✓
                </div>

                <div>
                  <h2>System recommendation</h2>
                  <p>
                    Suggested next step based on the
                    recorded check-in.
                  </p>
                </div>
              </div>

              <div className="recommendation-box">
                <p>
                  {caseItem.recommendation ||
                    "No recommendation recorded."}
                </p>
              </div>

              <div className="ai-note">
                <span>i</span>

                <p>
                  This recommendation is decision support.
                  The CHW and appropriate healthcare
                  professionals remain responsible for
                  the final care decision.
                </p>
              </div>
            </section>
          </div>

          {/* Follow-up */}
          <aside className="case-side-column">
            <section className="case-card followup-card">
              <div className="card-heading">
                <div className="heading-icon purple">
                  →
                </div>

                <div>
                  <h2>Record follow-up</h2>
                  <p>
                    Document the action taken for this case.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="action">
                  Action taken
                </label>

                <select
                  id="action"
                  value={action}
                  onChange={(e) =>
                    setAction(e.target.value)
                  }
                >
                  <option>
                    Follow-up initiated
                  </option>

                  <option>
                    Mother contacted
                  </option>

                  <option>
                    Referred for professional review
                  </option>

                  <option>
                    Follow-up completed
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">
                  Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Add relevant follow-up notes..."
                  rows="6"
                />
              </div>

              {message && (
                <div
                  className={`followup-message ${
                    message.includes("successfully")
                      ? "success"
                      : "error"
                  }`}
                >
                  <span>
                    {message.includes("successfully")
                      ? "✓"
                      : "!"}
                  </span>

                  {message}
                </div>
              )}

              <button
                className="record-button"
                onClick={handleFollowup}
                disabled={!user || loading}
              >
                {loading
                  ? "Recording..."
                  : "Record follow-up"}
              </button>
            </section>

            {/* Case information */}
            <section className="case-card info-card">
              <h3>Case information</h3>

              <div className="info-row">
                <span>Priority</span>

                <strong className={`text-${priority}`}>
                  {priorityLabel}
                </strong>
              </div>

              <div className="info-row">
                <span>Assessment ID</span>

                <strong>
                  {assessmentId
                    ? `${assessmentId.slice(0, 8)}...`
                    : "—"}
                </strong>
              </div>

              <div className="info-row">
                <span>Submitted</span>

                <strong>
                  {caseItem.health_checkins?.submitted_at
                    ? new Date(
                        caseItem.health_checkins.submitted_at
                      ).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CaseDetails;