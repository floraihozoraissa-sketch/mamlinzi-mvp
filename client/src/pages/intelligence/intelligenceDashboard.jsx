import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./IntelligenceDashboard.css";

function IntelligenceDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/intelligence/login");
          return;
        }

        // Load official profile
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", session.user.id)
            .single();

        if (profileError) {
          throw new Error("Could not load your profile.");
        }

        if (profileData.role !== "health_official") {
          await supabase.auth.signOut();
          navigate("/intelligence/login");
          return;
        }

        setProfile(profileData);

        // Load Intelligence Hub data
        const response = await fetch(
          "http://localhost:4000/api/intelligence/overview",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load intelligence data."
          );
        }

        setData(result);
      } catch (error) {
        console.error(
          "INTELLIGENCE DASHBOARD ERROR:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const activity = useMemo(() => {
    if (!data) return [];

    const assessments = (
      data.recentAssessments || []
    ).map((item) => ({
      id: `assessment-${item.id}`,
      type: "assessment",
      priority: item.priority,
      title: "Risk assessment recorded",
      description: `Priority: ${item.priority}`,
      date: item.created_at,
    }));

    const followups = (
      data.recentFollowups || []
    ).map((item) => ({
      id: `followup-${item.id}`,
      type: "followup",
      status: item.status,
      title:
        item.status === "completed"
          ? "Follow-up completed"
          : "Follow-up pending",
      description:
        item.action || "Follow-up action recorded",
      date: item.created_at,
    }));

    return [...assessments, ...followups]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 8);
  }, [data]);

  if (loading) {
    return (
      <div className="mm-page-state">
        <div className="mm-loader"></div>
        <p>Loading Intelligence Hub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mm-page-state">
        <h2>Unable to load Intelligence Hub</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hub-filter"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mm-page-state">
        <p>No intelligence data available.</p>
      </div>
    );
  }

  const {
    summary,
    priorityDistribution,
  } = data;

  const totalRisk =
    priorityDistribution.high +
    priorityDistribution.medium +
    priorityDistribution.low;

  const getPercentage = (value) => {
    if (!totalRisk) return 0;

    return Math.round(
      (value / totalRisk) * 100
    );
  };

  const officialName =
    profile?.full_name || "Health Official";

  const initials = officialName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="hub-layout">

      {/* SIDEBAR */}
      <aside className="hub-sidebar">

        <div className="hub-brand">
          <div className="hub-brand-icon">
            ✚
          </div>

          <div>
            <h2>Maternal Intelligence Hub</h2>

            <p>
              Community and maternal-health insights
            </p>
          </div>
        </div>

        <nav className="hub-nav">

          <button className="hub-nav-item active">
            <span>▦</span>
            Overview
          </button>

          <button className="hub-nav-item">
            <span>♧</span>
            Risk Registries
          </button>

          <button className="hub-nav-item">
            <span>✓</span>
            Follow-up Tracks
          </button>

          <button className="hub-nav-item">
            <span>⌘</span>
            Referral Networks
          </button>

          <button className="hub-nav-item">
            <span>⌁</span>
            Outcomes
          </button>

        </nav>

        <div className="hub-user">

          <div className="hub-avatar">
            {initials || "HO"}
          </div>

          <div>
            <strong>
              {officialName}
            </strong>

            <span>
              Health Programme
            </span>
          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="hub-main">

        <header className="hub-header">

          <div>

            <p className="hub-eyebrow">
              {new Date().toLocaleDateString(
                "en-GB",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <h1>
              Maternal Intelligence Hub
            </h1>

            <p>
              Community and maternal-health overview
            </p>

          </div>

          <div className="hub-header-actions">

            <button className="hub-filter">
              Current data
            </button>

            <button
              className="hub-notification"
              title="Notifications"
            >
              ♧
            </button>

          </div>

        </header>

        {/* KPI CARDS */}
        <section className="hub-kpis">

          <div className="hub-kpi-card">

            <span className="hub-kpi-label">
              MOTHERS REGISTERED
            </span>

            <strong>
              {summary.totalMothers}
            </strong>

            <span className="hub-kpi-caption">
              Across MaMlinzi
            </span>

          </div>

          <div className="hub-kpi-card">

            <span className="hub-kpi-label">
              HEALTH CHECK-INS
            </span>

            <strong>
              {summary.totalCheckins}
            </strong>

            <span className="hub-kpi-caption">
              Recorded check-ins
            </span>

          </div>

          <div className="hub-kpi-card priority">

            <span className="hub-kpi-label">
              HIGH-PRIORITY CASES
            </span>

            <strong>
              {summary.highPriority}
            </strong>

            <span className="hub-kpi-status">
              ● Needs review
            </span>

          </div>

          <div className="hub-kpi-card">

            <span className="hub-kpi-label">
              COMPLETED FOLLOW-UPS
            </span>

            <strong>
              {summary.completedFollowups}
            </strong>

            <span className="hub-kpi-caption">
              Recorded by CHWs
            </span>

          </div>

        </section>

        {/* MAIN GRID */}
        <section className="hub-grid">

          {/* RISK DISTRIBUTION */}
          <div className="hub-card">

            <div className="hub-card-header">

              <div>
                <h2>
                  Maternal Risk Distribution
                </h2>

                <p>
                  Current risk assessment distribution
                </p>
              </div>

            </div>

            <div className="risk-content">

              <div
                className="risk-donut"
                style={{
                  "--high": `${getPercentage(
                    priorityDistribution.high
                  )}%`,
                  "--medium": `${getPercentage(
                    priorityDistribution.medium
                  )}%`,
                }}
              >

                <div className="risk-donut-inner">

                  <span>Total</span>

                  <strong>
                    {totalRisk}
                  </strong>

                </div>

              </div>

              <div className="risk-legend">

                <div>
                  <span className="dot high"></span>
                  <span>High priority</span>
                  <strong>
                    {priorityDistribution.high}
                  </strong>
                </div>

                <div>
                  <span className="dot medium"></span>
                  <span>Medium priority</span>
                  <strong>
                    {priorityDistribution.medium}
                  </strong>
                </div>

                <div>
                  <span className="dot low"></span>
                  <span>Low priority</span>
                  <strong>
                    {priorityDistribution.low}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* FOLLOW-UP */}
          <div className="hub-card">

            <div className="hub-card-header">

              <div>
                <h2>
                  Follow-up Status
                </h2>

                <p>
                  Recorded follow-up activity
                </p>
              </div>

            </div>

            <div className="followup-list">

              <div className="followup-row">
                <div className="followup-label">
                  Completed
                </div>

                <strong>
                  {summary.completedFollowups}
                </strong>
              </div>

              <div className="followup-row">
                <div className="followup-label">
                  Pending
                </div>

                <strong>
                  {summary.pendingFollowups}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* RECENT ACTIVITY */}
        <section className="hub-card activity-card">

          <div className="hub-card-header">

            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest assessments and follow-up actions
              </p>
            </div>

          </div>

          <div className="activity-list">

            {activity.length === 0 ? (

              <div className="empty-state">
                No activity recorded yet.
              </div>

            ) : (

              activity.map((item) => (

                <div
                  className="activity-item"
                  key={item.id}
                >

                  <div
                    className={`activity-icon ${
                      item.type === "followup"
                        ? "followup"
                        : item.priority
                    }`}
                  >
                    {item.type === "followup"
                      ? "✓"
                      : "!"}
                  </div>

                  <div className="activity-info">

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.description}
                    </span>

                  </div>

                  <time>
                    {formatDate(item.date)}
                  </time>

                </div>

              ))

            )}

          </div>

        </section>

        {/* RESPONSIBLE AI NOTICE */}
        <div className="hub-ai-notice">

          <div className="hub-ai-icon">
            ✦
          </div>

          <div>

            <strong>
              AI-assisted decision support
            </strong>

            <p>
              MaMlinzi uses recorded information to
              support prioritization and follow-up.
              It does not replace clinical judgment.
              Healthcare professionals remain responsible
              for final decisions.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default IntelligenceDashboard;