import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./HealthCheckin.css";

function HealthCheckin() {
  const navigate = useNavigate();

  const [motherId, setMotherId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [responses, setResponses] = useState({
    feeling_unwell: false,
    severe_headache: false,
    bleeding: false,
    difficulty_breathing: false,
    attended_recent_anc: false,
    additional_notes: "",
  });

  useEffect(() => {
    const loadMother = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/mother/login");
          return;
        }

        const {
          data: motherProfile,
          error: profileError,
        } = await supabase
          .from("mother_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profileError || !motherProfile) {
          console.error(
            "MOTHER PROFILE ERROR:",
            profileError
          );

          setError(
            "Could not load your maternal profile."
          );

          return;
        }

        setMotherId(motherProfile.id);
      } catch (error) {
        console.error(
          "LOAD MOTHER ERROR:",
          error
        );

        setError(
          "Could not load your health check-in."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadMother();
  }, [navigate]);

  const handleChange = (field) => {
    setResponses((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/mother/login");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/checkins",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            responses,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "CHECK-IN API ERROR:",
          data
        );

        setError(
          data.error ||
            "Could not submit your check-in."
        );

        return;
      }

      console.log(
        "CHECK-IN SUCCESS:",
        data
      );

      setResult(data);
    } catch (error) {
      console.error(
        "CHECK-IN ERROR:",
        error
      );

      setError(
        "Could not connect to the MaMlinzi server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="checkin-loading">
        <div className="loading-mark">
          M
        </div>

        <p>
          Loading your health check-in...
        </p>
      </div>
    );
  }

  if (error && !motherId) {
    return (
      <div className="checkin-error-page">
        <div className="checkin-error-card">
          <div className="error-icon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/mother")
            }
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     RESULT SCREEN
  ========================= */

  if (result) {
    const assessment =
      result.riskAssessment;

    const priority =
      assessment?.priority?.toLowerCase();

    const priorityLabel =
      priority === "high"
        ? "High priority"
        : priority === "medium"
        ? "Medium priority"
        : "Low priority";

    return (
      <div className="checkin-page">
        <header className="checkin-topbar">
          <div className="checkin-brand">
            <div className="brand-mark">
              M
            </div>

            <div>
              <strong>
                MaMlinzi
              </strong>

              <span>
                Maternal care companion
              </span>
            </div>
          </div>
        </header>

        <main className="result-container">
          <section className="result-card">

            <div className="result-success-icon">
              ✓
            </div>

            <p className="result-eyebrow">
              CHECK-IN COMPLETE
            </p>

            <h1>
              Thank you for checking in.
            </h1>

            <p className="result-intro">
              Your health information has been
              recorded and processed by MaMlinzi.
            </p>

            {assessment && (
              <div
                className={`result-priority ${priority}`}
              >
                <div className="result-priority-top">
                  <span>
                    Current check-in status
                  </span>

                  <strong>
                    {priorityLabel}
                  </strong>
                </div>

                <p>
                  {assessment.recommendation}
                </p>
              </div>
            )}

            <div className="result-note">
              <span>i</span>

              <p>
                MaMlinzi provides supportive
                decision support. It does not
                replace care or advice from a
                qualified healthcare professional.
              </p>
            </div>

            <button
              className="result-button"
              onClick={() =>
                navigate("/mother")
              }
            >
              Return to dashboard
            </button>

            <button
              className="secondary-result-button"
              onClick={() => {
                setResult(null);
                setResponses({
                  feeling_unwell: false,
                  severe_headache: false,
                  bleeding: false,
                  difficulty_breathing: false,
                  attended_recent_anc: false,
                  additional_notes: "",
                });
              }}
            >
              Start another check-in
            </button>

          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="checkin-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="checkin-topbar">

        <div className="checkin-brand">
          <div className="brand-mark">
            M
          </div>

          <div>
            <strong>
              MaMlinzi
            </strong>

            <span>
              Maternal care companion
            </span>
          </div>
        </div>

        <button
          className="back-dashboard"
          onClick={() =>
            navigate("/mother")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="checkin-container">

        <section className="checkin-intro">

          <p className="checkin-eyebrow">
            DAILY HEALTH CHECK-IN
          </p>

          <h1>
            How are you feeling today?
          </h1>

          <p>
            Answer the questions below based
            on how you are feeling today. You
            can select more than one answer.
          </p>

        </section>

        <form
          className="checkin-form"
          onSubmit={handleSubmit}
        >

          {/* =========================
              QUESTIONS
          ========================= */}

          <section className="questions-card">

            <div className="questions-header">
              <div className="questions-number">
                1
              </div>

              <div>
                <h2>
                  Tell us how you are feeling
                </h2>

                <p>
                  Select anything that applies
                  to you today.
                </p>
              </div>
            </div>

            <div className="question-list">

              <label
                className={`question-option ${
                  responses.feeling_unwell
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    responses.feeling_unwell
                  }
                  onChange={() =>
                    handleChange(
                      "feeling_unwell"
                    )
                  }
                />

                <span className="custom-checkbox">
                  {responses.feeling_unwell
                    ? "✓"
                    : ""}
                </span>

                <span className="question-text">
                  I am feeling unwell.
                </span>
              </label>

              <label
                className={`question-option ${
                  responses.severe_headache
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    responses.severe_headache
                  }
                  onChange={() =>
                    handleChange(
                      "severe_headache"
                    )
                  }
                />

                <span className="custom-checkbox">
                  {responses.severe_headache
                    ? "✓"
                    : ""}
                </span>

                <span className="question-text">
                  I have a severe headache.
                </span>
              </label>

              <label
                className={`question-option ${
                  responses.bleeding
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    responses.bleeding
                  }
                  onChange={() =>
                    handleChange(
                      "bleeding"
                    )
                  }
                />

                <span className="custom-checkbox">
                  {responses.bleeding
                    ? "✓"
                    : ""}
                </span>

                <span className="question-text">
                  I have experienced bleeding.
                </span>
              </label>

              <label
                className={`question-option ${
                  responses.difficulty_breathing
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    responses.difficulty_breathing
                  }
                  onChange={() =>
                    handleChange(
                      "difficulty_breathing"
                    )
                  }
                />

                <span className="custom-checkbox">
                  {responses.difficulty_breathing
                    ? "✓"
                    : ""}
                </span>

                <span className="question-text">
                  I am having difficulty breathing.
                </span>
              </label>

              <label
                className={`question-option ${
                  responses.attended_recent_anc
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    responses.attended_recent_anc
                  }
                  onChange={() =>
                    handleChange(
                      "attended_recent_anc"
                    )
                  }
                />

                <span className="custom-checkbox">
                  {responses.attended_recent_anc
                    ? "✓"
                    : ""}
                </span>

                <span className="question-text">
                  I attended my recent ANC visit.
                </span>
              </label>

            </div>

          </section>

          {/* =========================
              NOTES
          ========================= */}

          <section className="notes-card">

            <div className="questions-header">
              <div className="questions-number teal">
                2
              </div>

              <div>
                <h2>
                  Anything else to share?
                </h2>

                <p>
                  This is optional.
                </p>
              </div>
            </div>

            <textarea
              value={
                responses.additional_notes
              }
              onChange={(e) =>
                setResponses(
                  (previous) => ({
                    ...previous,
                    additional_notes:
                      e.target.value,
                  })
                )
              }
              placeholder="Share anything else you would like your healthcare team to know..."
              rows="5"
            />

          </section>

          {/* =========================
              PRIVACY / AI NOTE
          ========================= */}

          <div className="checkin-information">

            <span>i</span>

            <p>
              Your responses are used to support
              your care journey and appropriate
              follow-up. MaMlinzi's assessment is
              supportive decision-making and does
              not replace professional medical
              judgment.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="checkin-error">
              <span>!</span>
              {error}
            </div>
          )}

          {/* =========================
              SUBMIT
          ========================= */}

          <button
            type="submit"
            className="submit-checkin"
            disabled={
              submitting || !motherId
            }
          >
            {submitting
              ? "Processing your check-in..."
              : "Submit health check-in"}

            {!submitting && (
              <span>→</span>
            )}
          </button>

          <p className="submit-caption">
            Please make sure your answers are
            accurate before submitting.
          </p>

        </form>

      </main>

    </div>
  );
}

export default HealthCheckin;