import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

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
      <div>
        <h1>Case not found</h1>
        <button onClick={() => navigate("/chw")}>
          Back to cases
        </button>
      </div>
    );
  }

  const mother =
    caseItem.health_checkins?.mother_profiles?.profiles;

  const motherProfile =
    caseItem.health_checkins?.mother_profiles;

  const handleFollowup = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:4000/api/followups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            motherId: caseItem.health_checkins.mother_profiles.id,
            chwId: user.id,
            assessmentId: caseItem.id,
            action,
            status: "completed",
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to record follow-up."
        );
      }

      setMessage("Follow-up recorded successfully.");
      setNotes("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/chw")}>
        ← Back to cases
      </button>

      <h1>{mother?.full_name || "Unknown mother"}</h1>

      <p>{mother?.phone || "Phone not available"}</p>

      <hr />

      <h2>Case Priority</h2>

      <p>
        <strong>{caseItem.priority.toUpperCase()}</strong>
      </p>

      <h2>Why was this case prioritized?</h2>

      {caseItem.triggered_rules?.length > 0 ? (
        <ul>
          {caseItem.triggered_rules.map((rule, index) => (
            <li key={index}>{rule.reason}</li>
          ))}
        </ul>
      ) : (
        <p>No rules recorded.</p>
      )}

      <h2>System Recommendation</h2>

      <p>{caseItem.recommendation}</p>

      <hr />

      <h2>Record Follow-up</h2>

      <label>Action</label>

      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
      >
        <option>Follow-up initiated</option>
        <option>Mother contacted</option>
        <option>Referred for professional review</option>
        <option>Follow-up completed</option>
      </select>

      <br />
      <br />

      <label>Notes</label>

      <br />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter follow-up notes..."
        rows="5"
      />

      <br />
      <br />

      <button
  onClick={handleFollowup}
  disabled={!user}
>
  Record Follow-up
</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CaseDetails;