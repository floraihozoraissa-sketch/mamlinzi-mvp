import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileText,
  HeartPulse,
  Loader2,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { supabase } from "../../services/supabase";
import "./CaseDetails.css";

const API_URL = "http://localhost:4000";

function formatDate(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("en-RW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPriorityLabel(priority) {
  if (priority === "high") return "HIGH PRIORITY";
  if (priority === "medium") return "NEEDS ATTENTION";
  return "ROUTINE";
}

function getPriorityClass(priority) {
  if (priority === "high") return "case-details-priority-high";
  if (priority === "medium") return "case-details-priority-medium";
  return "case-details-priority-low";
}

export default function CaseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [caseItem, setCaseItem] = useState(null);
  const [followup, setFollowup] = useState(null);

  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCase();
  }, [id]);

  async function loadCase() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/chw/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/chw/cases`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load this case."
        );
      }

      const foundCase = data.cases?.find(
        (item) => item.id === id
      );

      if (!foundCase) {
        setError("This case could not be found.");
        return;
      }

      setCaseItem(foundCase);
    } catch (err) {
      console.error("CASE DETAILS ERROR:", err);
      setError(
        err.message || "Could not load this case."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveFollowup() {
    if (!caseItem) return;

    if (!action.trim()) {
      setError("Please record the action taken before completing the follow-up.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/chw/login");
        return;
      }

      const motherProfile =
        caseItem.health_checkins?.mother_profiles;

      const motherId = motherProfile?.id;
      const assessmentId = caseItem.id;

      if (!motherId || !assessmentId) {
        throw new Error(
          "The case is missing the information needed to record a follow-up."
        );
      }

      const response = await fetch(
        `${API_URL}/api/followups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            motherId,
            assessmentId,
            action: action.trim(),
            status: "completed",
            notes: notes.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not record the follow-up."
        );
      }

      setFollowup(data.followup || null);
      setSuccess(true);
    } catch (err) {
      console.error("FOLLOW-UP SAVE ERROR:", err);
      setError(
        err.message ||
          "Could not record the follow-up."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="case-details-page">
        <div className="case-details-loading">
          <Loader2
            size={28}
            className="case-details-spinner"
          />
          <p>Loading case...</p>
        </div>
      </div>
    );
  }

  if (error && !caseItem) {
    return (
      <div className="case-details-page">
        <header className="case-details-header">
          <button
            className="case-details-back"
            onClick={() => navigate("/chw")}
          >
            <ArrowLeft size={20} />
            <span>Back to cases</span>
          </button>
        </header>

        <main className="case-details-container">
          <div className="case-details-error">
            <CircleAlert size={30} />
            <h2>Case unavailable</h2>
            <p>{error}</p>

            <button
              className="case-details-primary-btn"
              onClick={() => navigate("/chw")}
            >
              Back to cases
            </button>
          </div>
        </main>
      </div>
    );
  }

  const mother =
    caseItem?.health_checkins?.mother_profiles?.profiles;

  const motherProfile =
    caseItem?.health_checkins?.mother_profiles;

  const motherName =
    mother?.full_name || "Mother";

  const phone =
    mother?.phone || null;

  const priority =
    caseItem?.priority || "low";

  const triggeredRules =
    Array.isArray(caseItem?.triggered_rules)
      ? caseItem.triggered_rules
      : [];

  const recommendation =
    caseItem?.recommendation ||
    "Continue appropriate follow-up based on the information recorded.";

  const submittedAt =
    caseItem?.health_checkins?.submitted_at;

  const alreadyCompleted =
    success || followup?.status === "completed";

  return (
    <div className="case-details-page">
      <header className="case-details-header">
        <div className="case-details-header-inner">
          <button
            className="case-details-back"
            onClick={() => navigate("/chw")}
            aria-label="Back to cases"
          >
            <ArrowLeft size={20} />
            <span>Back to cases</span>
          </button>

          <div className="case-details-header-title">
            <span>Case review</span>
            <small>MaMlinzi CHW workspace</small>
          </div>
        </div>
      </header>

      <main className="case-details-container">
        {/* Intro */}
        <section className="case-details-intro">
          <div>
            <p className="case-details-eyebrow">
              CASE DETAILS
            </p>

            <h1>
              Review this case
            </h1>

            <p>
              Understand what was reported, review the
              guidance, and record what you did.
            </p>
          </div>
        </section>

        {/* WHO */}
        <section className="case-details-card case-details-who">
          <div className="case-details-section-heading">
            <div className="case-details-icon-wrap">
              <UserRound size={21} />
            </div>

            <div>
              <span>WHO</span>
              <h2>Mother</h2>
            </div>
          </div>

          <div className="case-details-person">
            <div className="case-details-avatar">
              {motherName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="case-details-person-info">
              <h3>{motherName}</h3>

              {phone && (
                <p>{phone}</p>
              )}

              {submittedAt && (
                <span>
                  Check-in submitted{" "}
                  {formatDate(submittedAt)}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* PRIORITY */}
        <section className="case-details-card">
          <div className="case-details-section-heading">
            <div className="case-details-icon-wrap">
              <HeartPulse size={21} />
            </div>

            <div>
              <span>PRIORITY</span>
              <h2>Case priority</h2>
            </div>
          </div>

          <div
            className={`case-details-priority ${getPriorityClass(
              priority
            )}`}
          >
            <div className="case-details-priority-icon">
              {priority === "high" ? (
                <CircleAlert size={22} />
              ) : priority === "medium" ? (
                <Clock3 size={22} />
              ) : (
                <ShieldCheck size={22} />
              )}
            </div>

            <div>
              <strong>
                {getPriorityLabel(priority)}
              </strong>

              <p>
                This priority is based on the
                information recorded during the
                mother's check-in.
              </p>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="case-details-card">
          <div className="case-details-section-heading">
            <div className="case-details-icon-wrap">
              <CircleAlert size={21} />
            </div>

            <div>
              <span>WHY</span>
              <h2>What was reported?</h2>
            </div>
          </div>

          {triggeredRules.length > 0 ? (
            <div className="case-details-reasons">
              {triggeredRules.map(
                (rule, index) => (
                  <div
                    className="case-details-reason"
                    key={`${rule.rule || "reason"}-${index}`}
                  >
                    <Check size={18} />

                    <p>
                      {rule.reason ||
                        "A concern was reported during the check-in."}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="case-details-no-concern">
              <Check size={18} />
              <p>
                No specific priority concern was
                triggered by the recorded check-in.
              </p>
            </div>
          )}
        </section>

        {/* GUIDANCE */}
        <section className="case-details-card case-details-guidance">
          <div className="case-details-section-heading">
            <div className="case-details-icon-wrap">
              <ClipboardCheck size={21} />
            </div>

            <div>
              <span>GUIDANCE</span>
              <h2>What the system suggests</h2>
            </div>
          </div>

          <div className="case-details-guidance-box">
            <p>
              {recommendation}
            </p>
          </div>

          <div className="case-details-ai-note">
            <ShieldCheck size={18} />

            <p>
              MaMlinzi provides decision support based
              on the information recorded. A qualified
              healthcare professional remains responsible
              for clinical decisions.
            </p>
          </div>
        </section>

        {/* FOLLOW-UP */}
        <section className="case-details-card case-details-followup">
          <div className="case-details-section-heading">
            <div className="case-details-icon-wrap">
              <FileText size={21} />
            </div>

            <div>
              <span>FOLLOW-UP</span>
              <h2>Record what you did</h2>
            </div>
          </div>

          {alreadyCompleted ? (
            <div className="case-details-complete">
              <div className="case-details-complete-icon">
                <Check size={28} />
              </div>

              <div>
                <h3>
                  Follow-up recorded
                </h3>

                <p>
                  This case has been marked as
                  completed. The mother can now see
                  the follow-up update in her journey.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="case-details-field">
                <label htmlFor="action">
                  Action taken
                  <span>*</span>
                </label>

                <textarea
                  id="action"
                  value={action}
                  onChange={(event) =>
                    setAction(event.target.value)
                  }
                  placeholder="Example: Contacted the mother and arranged a follow-up visit."
                  rows={4}
                />

                <small>
                  Record the action or next step agreed
                  with the mother.
                </small>
              </div>

              <div className="case-details-field">
                <label htmlFor="notes">
                  Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Add any useful follow-up notes..."
                  rows={4}
                />

                <small>
                  Keep notes clear and relevant to the
                  follow-up.
                </small>
              </div>

              {error && (
                <div className="case-details-form-error">
                  <CircleAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="case-details-complete-btn"
                onClick={saveFollowup}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={19}
                      className="case-details-spinner"
                    />
                    Saving follow-up...
                  </>
                ) : (
                  <>
                    <Check size={19} />
                    Mark follow-up complete
                  </>
                )}
              </button>
            </>
          )}
        </section>

        {/* Success */}
        {alreadyCompleted && (
          <section className="case-details-next">
            <div className="case-details-next-icon">
              <MessageCircle size={21} />
            </div>

            <div>
              <h3>
                The care loop is now connected
              </h3>

              <p>
                The follow-up information is available
                for the mother to view in her MaMlinzi
                journey.
              </p>
            </div>

            <ChevronRight size={20} />
          </section>
        )}

        <button
          className="case-details-bottom-back"
          onClick={() => navigate("/chw")}
        >
          <ArrowLeft size={18} />
          Back to my cases
        </button>
      </main>
    </div>
  );
}