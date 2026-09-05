import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CHWDashboard() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:4000/api/chw/cases"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load cases."
        );
      }

      setCases(data.cases || []);
    } catch (error) {
      console.error("Error loading CHW cases:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const getPriorityLabel = (priority) => {
    return priority?.toUpperCase() || "UNKNOWN";
  };

  if (loading) {
    return <p>Loading priority cases...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Unable to load cases.</p>
        <p>{error}</p>

        <button onClick={fetchCases}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>CHW Dashboard</h1>

      <p>
        Priority cases requiring follow-up
      </p>

      <div>
        <strong>Total cases:</strong> {cases.length}
      </div>

      {cases.length === 0 ? (
        <p>No priority cases available.</p>
      ) : (
        <div>
          {cases.map((caseItem) => {
            const mother =
              caseItem.health_checkins?.mother_profiles
                ?.profiles;

            return (
              <article key={caseItem.id}>
                <h2>
                  {mother?.full_name || "Unknown mother"}
                </h2>

                <p>
                  <strong>Priority:</strong>{" "}
                  {getPriorityLabel(caseItem.priority)}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {mother?.phone || "Not available"}
                </p>

                <p>
                  <strong>Assessment:</strong>{" "}
                  {new Date(
                    caseItem.created_at
                  ).toLocaleString()}
                </p>

                <h3>Why was this case prioritized?</h3>

                {caseItem.triggered_rules?.length > 0 ? (
                  <ul>
                    {caseItem.triggered_rules.map(
                      (rule, index) => (
                        <li key={index}>
                          {rule.reason}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No rules recorded.</p>
                )}

                <h3>Recommendation</h3>

                <p>
                  {caseItem.recommendation ||
                    "No recommendation available."}
                </p>

                <button
  onClick={() =>
    navigate("/chw/case", {
      state: { caseItem },
    })
  }
>
  View Case
</button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CHWDashboard;