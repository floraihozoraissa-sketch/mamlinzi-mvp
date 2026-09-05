import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./CHWDashboard.css";

function CHWDashboard() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCases = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/chw/login");
          return;
        }

        const response = await fetch(
          "http://localhost:4000/api/chw/cases",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("CHW CASES API ERROR:", data);

          setError(
            data.error || "Failed to load cases."
          );

          return;
        }

        setCases(
          Array.isArray(data)
            ? data
            : Array.isArray(data.cases)
              ? data.cases
              : []
        );
      } catch (error) {
        console.error("CHW CASES ERROR:", error);
        setError("Failed to load cases.");
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, [navigate]);

  const statistics = useMemo(() => {
    const high = cases.filter(
      (item) => item.priority === "high"
    ).length;

    const medium = cases.filter(
      (item) => item.priority === "medium"
    ).length;

    const low = cases.filter(
      (item) => item.priority === "low"
    ).length;

    return {
      total: cases.length,
      high,
      medium,
      low,
    };
  }, [cases]);

  const getPriorityLabel = (priority) => {
    if (priority === "high") return "High priority";
    if (priority === "medium") return "Medium priority";
    return "Low priority";
  };

  const getMotherName = (caseItem) =>
    caseItem.health_checkins?.mother_profiles?.profiles
      ?.full_name || "Mother";

  const getPhone = (caseItem) =>
    caseItem.health_checkins?.mother_profiles?.profiles
      ?.phone || "Not available";

  const getInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <div className="mm-page-state">
        <div className="mm-loader"></div>
        <p>Loading your cases...</p>
      </div>
    );
  }

  return (
    <div className="chw-layout">

      {/* SIDEBAR */}
      <aside className="chw-sidebar">

        <div className="chw-brand">
          <div className="chw-brand-icon">
            ✚
          </div>

          <div>
            <h2>MaMlinzi</h2>
            <p>Community Health Worker</p>
          </div>
        </div>

        <nav className="chw-nav">

          <button className="chw-nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button className="chw-nav-item">
            <span>!</span>
            Priority Cases
            {statistics.high > 0 && (
              <b>{statistics.high}</b>
            )}
          </button>

          <button className="chw-nav-item">
            <span>✓</span>
            Follow-ups
          </button>

          <button className="chw-nav-item">
            <span>♧</span>
            Mothers
          </button>

        </nav>

        <div className="chw-sidebar-footer">

          <div className="chw-avatar">
            CHW
          </div>

          <div>
            <strong>Community Health Worker</strong>
            <span>MaMlinzi</span>
          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="chw-main">

        <header className="chw-header">

          <div>
            <p className="chw-eyebrow">
              CHW WORKSPACE
            </p>

            <h1>
              Good day 👋
            </h1>

            <p>
              Review priority cases and follow up with mothers who may need attention.
            </p>
          </div>

          <div className="chw-header-actions">

            <button
              className="chw-icon-button"
              title="Notifications"
            >
              ♧
            </button>

          </div>

        </header>

        {/* SUMMARY */}
        <section className="chw-summary">

          <div className="chw-summary-card">

            <div className="chw-summary-icon purple">
              ▦
            </div>

            <div>
              <span>Total cases</span>
              <strong>{statistics.total}</strong>
            </div>

          </div>

          <div className="chw-summary-card urgent">

            <div className="chw-summary-icon red">
              !
            </div>

            <div>
              <span>High priority</span>
              <strong>{statistics.high}</strong>
            </div>

          </div>

          <div className="chw-summary-card">

            <div className="chw-summary-icon amber">
              !
            </div>

            <div>
              <span>Medium priority</span>
              <strong>{statistics.medium}</strong>
            </div>

          </div>

          <div className="chw-summary-card">

            <div className="chw-summary-icon teal">
              ✓
            </div>

            <div>
              <span>Low priority</span>
              <strong>{statistics.low}</strong>
            </div>

          </div>

        </section>

        {/* CASES */}
        <section className="chw-cases-section">

          <div className="chw-section-header">

            <div>
              <h2>Priority cases</h2>

              <p>
                Cases requiring your review and follow-up.
              </p>
            </div>

            <span className="chw-case-count">
              {statistics.total} cases
            </span>

          </div>

          {error && (
            <div className="chw-error">
              <strong>Unable to load cases</strong>
              <span>{error}</span>
            </div>
          )}

          {!error && cases.length === 0 && (
            <div className="chw-empty">
              <div className="chw-empty-icon">
                ✓
              </div>

              <h3>No priority cases</h3>

              <p>
                There are currently no cases requiring your attention.
              </p>
            </div>
          )}

          {!error && cases.length > 0 && (
            <div className="chw-case-list">

              {cases.map((caseItem) => {

                const motherName =
                  getMotherName(caseItem);

                const priority =
                  caseItem.priority || "low";

                return (
                  <article
                    className="chw-case-card"
                    key={caseItem.id}
                  >

                    <div className="chw-case-main">

                      <div className="chw-mother-avatar">
                        {getInitials(motherName)}
                      </div>

                      <div className="chw-case-info">

                        <div className="chw-case-title-row">

                          <h3>
                            {motherName}
                          </h3>

                          <span
                            className={`chw-priority ${priority}`}
                          >
                            <i></i>
                            {getPriorityLabel(priority)}
                          </span>

                        </div>

                        <p className="chw-phone">
                          {getPhone(caseItem)}
                        </p>

                        <div className="chw-reason">

                          <strong>
                            Why this case was prioritized
                          </strong>

                          {caseItem.triggered_rules?.length > 0 ? (
                            <ul>
                              {caseItem.triggered_rules
                                .slice(0, 2)
                                .map((rule, index) => (
                                  <li key={index}>
                                    {rule.reason ||
                                      rule.rule}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p>
                              No specific trigger was recorded.
                            </p>
                          )}

                        </div>

                        {caseItem.recommendation && (
                          <div className="chw-recommendation">

                            <span>Suggested action</span>

                            <p>
                              {caseItem.recommendation}
                            </p>

                          </div>
                        )}

                      </div>

                    </div>

                    <div className="chw-case-action">

                      <button
                        className="chw-view-button"
                        onClick={() =>
                          navigate("/chw/case", {
                            state: {
                              caseItem,
                            },
                          })
                        }
                      >
                        View case
                        <span>→</span>
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* RESPONSIBLE AI */}
        <div className="chw-ai-notice">

          <div className="chw-ai-icon">
            ✦
          </div>

          <div>
            <strong>
              MaMlinzi decision support
            </strong>

            <p>
              Priority cases are generated from recorded
              check-in information. Review the case details
              and use your professional judgment when
              deciding the next step.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default CHWDashboard;