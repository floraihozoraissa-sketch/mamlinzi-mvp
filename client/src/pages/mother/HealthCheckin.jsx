import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/mother/login");
        return;
      }

      const { data: motherProfile, error } = await supabase
        .from("mother_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("MOTHER PROFILE ERROR:", error);
        setError("Could not load your maternal profile.");
        setLoadingProfile(false);
        return;
      }

      setMotherId(motherProfile.id);
      setLoadingProfile(false);
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
        setError(data.error || "Could not submit your check-in.");
        setSubmitting(false);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("CHECK-IN ERROR:", error);
      setError("Could not connect to the MaMlinzi server.");
    }

    setSubmitting(false);
  };

  if (loadingProfile) {
    return <p>Loading your health check-in...</p>;
  }

  if (error && !motherId) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/mother")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Today's Health Check-in</h1>

      <p>
        Please answer these questions based on how you are
        feeling today.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={responses.feeling_unwell}
              onChange={() =>
                handleChange("feeling_unwell")
              }
            />
            I am feeling unwell.
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={responses.severe_headache}
              onChange={() =>
                handleChange("severe_headache")
              }
            />
            I have a severe headache.
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={responses.bleeding}
              onChange={() =>
                handleChange("bleeding")
              }
            />
            I have experienced bleeding.
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={responses.difficulty_breathing}
              onChange={() =>
                handleChange("difficulty_breathing")
              }
            />
            I am having difficulty breathing.
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={responses.attended_recent_anc}
              onChange={() =>
                handleChange("attended_recent_anc")
              }
            />
            I attended my recent ANC visit.
          </label>
        </div>

        <div>
          <label>
            Additional notes
          </label>

          <textarea
            value={responses.additional_notes}
            onChange={(e) =>
              setResponses((previous) => ({
                ...previous,
                additional_notes: e.target.value,
              }))
            }
            placeholder="Anything else you would like your healthcare team to know?"
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !motherId}
        >
          {submitting
            ? "Processing check-in..."
            : "Submit Check-in"}
        </button>
      </form>

      {result && (
        <div>
          <h2>Check-in Submitted</h2>

          <p>
            Your check-in has been processed by MaMlinzi.
          </p>

          {result.riskAssessment && (
            <>
              <h3>
                Priority:{" "}
                {result.riskAssessment.priority}
              </h3>

              <p>
                {result.riskAssessment.recommendation}
              </p>
            </>
          )}

          <button onClick={() => navigate("/mother")}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default HealthCheckin;