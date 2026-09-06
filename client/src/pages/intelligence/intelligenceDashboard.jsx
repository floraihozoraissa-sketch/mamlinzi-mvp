import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  ClipboardList,
  CheckCircle2,
  Network,
  BarChart3,
  Bell
} from "lucide-react";

import { supabase } from "../../services/supabase";
import "./IntelligenceDashboard.css";
import MamlinziLogo from "@/components/MaMlinziLogo";

const API_URL = "http://localhost:4000";

function IntelligenceDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/intelligence/login");
        return;
      }

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        throw new Error(
          "Could not load your MaMlinzi profile."
        );
      }

      if (profileData.role !== "health_official") {
        await supabase.auth.signOut();
        navigate("/intelligence/login");
        return;
      }

      setProfile(profileData);

      const response = await fetch(
        `${API_URL}/api/intelligence/overview`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not load intelligence data."
        );
      }

      setDashboard(data);
    } catch (err) {
      console.error(
        "INTELLIGENCE DASHBOARD ERROR:",
        err
      );

      setError(
        err.message ||
          "Could not load the Intelligence Hub."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/intelligence/login");
  }

  /*
   * The normalizer lets the UI tolerate small changes
   * in the API response without requiring a redesign.
   */
  const normalized = useMemo(() => {
    const source =
      dashboard?.overview ||
      dashboard?.summary ||
      dashboard?.stats ||
      dashboard ||
      {};

    const totalMothers = Number(
      source.totalMothers ??
        source.total_mothers ??
        source.mothers ??
        dashboard?.totalMothers ??
        0
    );

    const highPriority = Number(
      source.highPriority ??
        source.high_priority ??
        source.highRisk ??
        source.high_risk ??
        dashboard?.highPriority ??
        0
    );

    const mediumPriority = Number(
      source.mediumPriority ??
        source.medium_priority ??
        source.mediumRisk ??
        source.medium_risk ??
        dashboard?.mediumPriority ??
        0
    );

    const lowPriority = Number(
      source.lowPriority ??
        source.low_priority ??
        source.lowRisk ??
        source.low_risk ??
        dashboard?.lowPriority ??
        0
    );

    const completedFollowups = Number(
      source.completedFollowups ??
        source.completed_followups ??
        source.followupsCompleted ??
        dashboard?.completedFollowups ??
        0
    );

    const pendingFollowups = Number(
      source.pendingFollowups ??
        source.pending_followups ??
        source.followupsPending ??
        dashboard?.pendingFollowups ??
        0
    );

    const assessments = Number(
      source.totalAssessments ??
        source.total_assessments ??
        dashboard?.totalAssessments ??
        0
    );

    const recentActivity =
      dashboard?.recentActivity ||
      dashboard?.recent_activity ||
      source.recentActivity ||
      [];

    return {
      totalMothers,
      highPriority,
      mediumPriority,
      lowPriority,
      completedFollowups,
      pendingFollowups,
      assessments,
      recentActivity: Array.isArray(
        recentActivity
      )
        ? recentActivity
        : [],
    };
  }, [dashboard]);

  const totalRiskCases =
    normalized.highPriority +
    normalized.mediumPriority +
    normalized.lowPriority;

  const riskDistribution = [
    {
      label: "High priority",
      value: normalized.highPriority,
      className: "hub-risk-high",
    },
    {
      label: "Needs attention",
      value: normalized.mediumPriority,
      className: "hub-risk-medium",
    },
    {
      label: "Routine",
      value: normalized.lowPriority,
      className: "hub-risk-low",
    },
  ];

  function getRiskPercentage(value) {
    if (!totalRiskCases) return 0;

    return Math.round(
      (value / totalRiskCases) * 100
    );
  }

  function getActivityIcon(item) {
    const text = JSON.stringify(item)
      .toLowerCase();

    if (
      text.includes("follow") ||
      text.includes("complete")
    ) {
      return <CheckCircle2 size={18} />;
    }

    if (
      text.includes("high") ||
      text.includes("alert") ||
      text.includes("risk")
    ) {
      return <AlertCircle size={18} />;
    }

    return <Activity size={18} />;
  }

  function getActivityTitle(item) {
    return (
      item.title ||
      item.activity ||
      item.action ||
      item.type ||
      "Programme activity"
    );
  }

  function getActivityDescription(item) {
    return (
      item.description ||
      item.message ||
      item.details ||
      item.reason ||
      "Recent activity recorded in MaMlinzi."
    );
  }

  function getActivityDate(item) {
    const date =
      item.created_at ||
      item.createdAt ||
      item.timestamp ||
      item.date;

    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString(
      "en-RW",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  if (loading) {
  return (
    <div className="intelligence-loading-page">
      <div className="intelligence-loading-content">

        <div className="intelligence-loading-illustration">
          <div className="intelligence-loading-mother">
            <div className="intelligence-loading-head" />
            <div className="intelligence-loading-body" />
          </div>

          <div className="intelligence-loading-baby">
            <div className="intelligence-loading-baby-head" />
            <div className="intelligence-loading-baby-body" />
          </div>

          <div className="intelligence-loading-heart">
            ♥
          </div>
        </div>

        <h2>Preparing your overview</h2>

        <p>
          Gathering the latest maternal care information...
        </p>

        <div className="intelligence-loading-dots">
          <span />
          <span />
          <span />
        </div>

      </div>
    </div>
  );
}

  if (error && !dashboard) {
    return (
      <div className="hub-page">
        <div className="hub-error-state">
          <div className="hub-error-icon">
            <AlertCircle size={30} />
          </div>

          <h1>
            We couldn't load the Hub
          </h1>

          <p>{error}</p>

          <button
            className="hub-primary-button"
            onClick={() => loadDashboard()}
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-page">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`hub-sidebar ${
          mobileMenuOpen
            ? "hub-sidebar-open"
            : ""
        }`}
      >
        <div className="hub-sidebar-top">
          <div className="hub-brand">
            <MamlinziLogo/>

            <div>
              <strong>MaMlinzi</strong>
              <span>Intelligence Hub</span>
            </div>
          </div>

          <button
            className="hub-mobile-close"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="hub-navigation">
          <p className="hub-nav-label">
            WORKSPACE
          </p>

          <button className="hub-nav-item hub-nav-active">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </button>

          <button className="hub-nav-item">
            <BarChart3 size={19} />
            <span>Insights</span>
            <span className="hub-nav-soon">
              Soon
            </span>
          </button>

          <button className="hub-nav-item">
            <Activity size={19} />
            <span>Activity</span>
            <span className="hub-nav-soon">
              Soon
            </span>
          </button>

          <p className="hub-nav-label hub-nav-label-spaced">
            SUPPORT
          </p>

          <button className="hub-nav-item">
            <CircleHelp size={19} />
            <span>Help</span>
          </button>
        </nav>

        <div className="hub-sidebar-bottom">
          <div className="hub-sidebar-profile">
            <div className="hub-profile-avatar">
              {(profile?.full_name ||
                "O"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {profile?.full_name ||
                  "Health Official"}
              </strong>

              <span>
                Health official
              </span>
            </div>
          </div>

          <button
            className="hub-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          className="hub-sidebar-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      {/* =========================
          MAIN
      ========================= */}

      <main className="hub-main">
        <header className="hub-header">
          <div className="hub-header-left">
            <button
              className="hub-menu-button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="hub-header-label">
                MATERNAL INTELLIGENCE
              </p>

              <h1>
                Programme overview
              </h1>
            </div>
          </div>

          <div className="hub-header-actions">
            <button
              className="hub-refresh-button"
              onClick={() =>
                loadDashboard(true)
              }
              disabled={refreshing}
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "hub-refresh-spin"
                    : ""
                }
              />

              <span>
                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </span>
            </button>
          </div>
        </header>

        <div className="hub-content">
          {/* =========================
              INTRO
          ========================= */}

          <section className="hub-welcome">
            <div>
              <h2>
                Good{" "}
                {new Date().getHours() < 12
                  ? "morning"
                  : new Date().getHours() < 18
                  ? "afternoon"
                  : "evening"}
                {profile?.full_name
                  ? `, ${profile.full_name.split(" ")[0]}`
                  : ""}
                .
              </h2>

              <p>
                Here is the latest picture of
                maternal care activity across
                your programme.
              </p>
            </div>

            <div className="hub-trust-badge">
              <ShieldCheck size={17} />
              <span>
                Programme data
              </span>
            </div>
          </section>

          {error && dashboard && (
            <div className="hub-inline-error">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {/* =========================
              SUMMARY
          ========================= */}

          <section className="hub-summary-grid">
            <div className="hub-summary-card">
              <div className="hub-summary-icon hub-summary-purple">
                <Users size={21} />
              </div>

              <div className="hub-summary-copy">
                <span>
                  Mothers supported
                </span>

                <strong>
                  {normalized.totalMothers}
                </strong>

                <small>
                  Registered in the programme
                </small>
              </div>
            </div>

            <div className="hub-summary-card">
              <div className="hub-summary-icon hub-summary-red">
                <AlertCircle size={21} />
              </div>

              <div className="hub-summary-copy">
                <span>
                  High priority
                </span>

                <strong>
                  {normalized.highPriority}
                </strong>

                <small>
                  Cases requiring attention
                </small>
              </div>
            </div>

            <div className="hub-summary-card">
              <div className="hub-summary-icon hub-summary-teal">
                <CheckCircle2 size={21} />
              </div>

              <div className="hub-summary-copy">
                <span>
                  Follow-ups completed
                </span>

                <strong>
                  {normalized.completedFollowups}
                </strong>

                <small>
                  Recorded by CHWs
                </small>
              </div>
            </div>

            <div className="hub-summary-card">
              <div className="hub-summary-icon hub-summary-amber">
                <Clock3 size={21} />
              </div>

              <div className="hub-summary-copy">
                <span>
                  Follow-ups pending
                </span>

                <strong>
                  {normalized.pendingFollowups}
                </strong>

                <small>
                  Still awaiting completion
                </small>
              </div>
            </div>
          </section>

          {/* =========================
              ANALYTICS ROW
          ========================= */}

          <section className="hub-analytics-grid">
            {/* Risk distribution */}
            <div className="hub-panel">
              <div className="hub-panel-header">
                <div>
                  <span className="hub-panel-kicker">
                    CURRENT PICTURE
                  </span>

                  <h3>
                    Case priority distribution
                  </h3>
                </div>

                <div className="hub-panel-icon">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="hub-risk-total">
                <strong>
                  {totalRiskCases}
                </strong>

                <span>
                  assessed cases
                </span>
              </div>

              <div className="hub-risk-list">
                {riskDistribution.map(
                  (item) => {
                    const percentage =
                      getRiskPercentage(
                        item.value
                      );

                    return (
                      <div
                        className="hub-risk-row"
                        key={item.label}
                      >
                        <div className="hub-risk-row-top">
                          <div className="hub-risk-name">
                            <span
                              className={`hub-risk-dot ${item.className}`}
                            />
                            <span>
                              {item.label}
                            </span>
                          </div>

                          <strong>
                            {item.value}
                          </strong>
                        </div>

                        <div className="hub-progress">
                          <span
                            className={
                              item.className
                            }
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <span className="hub-risk-percent">
                          {percentage}%
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Follow-up */}
            <div className="hub-panel">
              <div className="hub-panel-header">
                <div>
                  <span className="hub-panel-kicker">
                    CARE CONTINUITY
                  </span>

                  <h3>
                    Follow-up status
                  </h3>
                </div>

                <div className="hub-panel-icon">
                  <FileBarChart size={19} />
                </div>
              </div>

              <div className="hub-followup-content">
                <div className="hub-followup-number">
                  <strong>
                    {normalized.completedFollowups}
                  </strong>

                  <span>
                    completed
                  </span>
                </div>

                <div className="hub-followup-number hub-followup-pending">
                  <strong>
                    {normalized.pendingFollowups}
                  </strong>

                  <span>
                    pending
                  </span>
                </div>
              </div>

              <div className="hub-followup-bar">
                <span
                  style={{
                    width: `${
                      normalized.completedFollowups +
                        normalized.pendingFollowups >
                      0
                        ? Math.round(
                            (normalized.completedFollowups /
                              (normalized.completedFollowups +
                                normalized.pendingFollowups)) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="hub-followup-footer">
                <span>
                  Completion rate
                </span>

                <strong>
                  {normalized.completedFollowups +
                    normalized.pendingFollowups >
                  0
                    ? Math.round(
                        (normalized.completedFollowups /
                          (normalized.completedFollowups +
                            normalized.pendingFollowups)) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </div>
            </div>
          </section>

          {/* =========================
              PROGRAMME SNAPSHOT
          ========================= */}

          <section className="hub-snapshot">
            <div className="hub-snapshot-copy">
              <div className="hub-snapshot-icon">
                <HeartPulse size={22} />
              </div>

              <div>
                <span>
                  PROGRAMME SNAPSHOT
                </span>

                <h3>
                  Turning recorded information
                  into action
                </h3>

                <p>
                  MaMlinzi helps teams see where
                  attention may be needed and
                  whether follow-up is being
                  completed.
                </p>
              </div>
            </div>

            <div className="hub-snapshot-stat">
              <strong>
                {normalized.assessments ||
                  totalRiskCases}
              </strong>

              <span>
                assessments recorded
              </span>
            </div>
          </section>

          {/* =========================
              RECENT ACTIVITY
          ========================= */}

          <section className="hub-panel hub-activity-panel">
            <div className="hub-panel-header">
              <div>
                <span className="hub-panel-kicker">
                  WHAT CHANGED
                </span>

                <h3>
                  Recent activity
                </h3>
              </div>

              <button className="hub-view-all">
                View activity
                <ChevronRight size={16} />
              </button>
            </div>

            {normalized.recentActivity.length >
            0 ? (
              <div className="hub-activity-list">
                {normalized.recentActivity
                  .slice(0, 6)
                  .map((item, index) => (
                    <div
                      className="hub-activity-item"
                      key={
                        item.id ||
                        `${index}-${getActivityTitle(
                          item
                        )}`
                      }
                    >
                      <div className="hub-activity-icon">
                        {getActivityIcon(item)}
                      </div>

                      <div className="hub-activity-content">
                        <strong>
                          {getActivityTitle(
                            item
                          )}
                        </strong>

                        <p>
                          {getActivityDescription(
                            item
                          )}
                        </p>
                      </div>

                      <span className="hub-activity-date">
                        {getActivityDate(item)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="hub-empty-activity">
                <Activity size={24} />

                <h4>
                  No recent activity
                </h4>

                <p>
                  New programme activity will
                  appear here as cases and
                  follow-ups are recorded.
                </p>
              </div>
            )}
          </section>

          {/* =========================
              RESPONSIBLE AI
          ========================= */}

          <section className="hub-responsible-ai">
            <div className="hub-responsible-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>
                Responsible decision support
              </strong>

              <p>
                MaMlinzi uses recorded information
                to surface patterns and support
                programme decisions. It does not
                replace professional judgement or
                clinical decision-making.
              </p>
            </div>
          </section>
        </div>

        <footer className="hub-footer">
          <span>
            MaMlinzi Intelligence Hub
          </span>

          <span>
            Maternal health programme intelligence
          </span>
        </footer>
      </main>
    </div>
  );
}

export default IntelligenceDashboard;