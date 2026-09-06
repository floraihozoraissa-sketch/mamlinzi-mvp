import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartPulse,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import "./CHWDashboard.css";
import MamlinziLogo from "@/components/MaMlinziLogo";

function CHWDashboard() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadCases();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("CHW PROFILE ERROR:", error);
    }
  };

  const loadCases = async (isRefresh = false) => {
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
        throw new Error(
          data.error || "Could not load your cases."
        );
      }

      setCases(data.cases || []);
    } catch (err) {
      console.error("CHW DASHBOARD ERROR:", err);

      setError(
        err.message ||
          "Something went wrong while loading your cases."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/chw/login");
  };

  const getPriority = (caseItem) => {
    return (
      caseItem?.priority?.toLowerCase() || "low"
    );
  };

  const getMother = (caseItem) => {
    return (
      caseItem?.health_checkins
        ?.mother_profiles
        ?.profiles || {}
    );
  };

  const getMotherName = (caseItem) => {
    const mother = getMother(caseItem);

    return mother.full_name || "Mother";
  };

  const getMotherPhone = (caseItem) => {
    const mother = getMother(caseItem);

    return mother.phone || "";
  };

  const getReason = (caseItem) => {
    const rules = caseItem?.triggered_rules;

    if (!Array.isArray(rules) || rules.length === 0) {
      return "No priority concern was identified.";
    }

    return rules[0]?.reason || "Follow-up may be needed.";
  };

  const getRecommendation = (caseItem) => {
    return (
      caseItem?.recommendation ||
      "Continue appropriate follow-up based on the information available."
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-RW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const firstName =
    profile?.full_name?.trim()?.split(" ")[0] ||
    "there";

  const stats = useMemo(() => {
    const high = cases.filter(
      (item) => getPriority(item) === "high"
    ).length;

    const medium = cases.filter(
      (item) => getPriority(item) === "medium"
    ).length;

    const low = cases.filter(
      (item) =>
        getPriority(item) === "low"
    ).length;

    return {
      total: cases.length,
      high,
      medium,
      low,
    };
  }, [cases]);

  const filteredCases = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return cases.filter((caseItem) => {
      const priority = getPriority(caseItem);
      const motherName =
        getMotherName(caseItem).toLowerCase();

      const matchesFilter =
        filter === "all" ||
        priority === filter;

      const matchesSearch =
        !normalizedSearch ||
        motherName.includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [cases, filter, search]);

  const highCases = filteredCases.filter(
    (item) => getPriority(item) === "high"
  );

  const mediumCases = filteredCases.filter(
    (item) => getPriority(item) === "medium"
  );

  const lowCases = filteredCases.filter(
    (item) => getPriority(item) === "low"
  );

  const openCase = (caseItem) => {
    navigate(`/chw/cases/${caseItem.id}`);
  };

  const renderCaseCard = (caseItem) => {
    const priority = getPriority(caseItem);
    const motherName = getMotherName(caseItem);
    const reason = getReason(caseItem);
    const recommendation =
      getRecommendation(caseItem);

    return (
      <article
        className={`chw-case-card priority-${priority}`}
        key={caseItem.id}
      >
        <div className="chw-case-top">
          <div className="chw-mother-identity">
            <div className="chw-mother-avatar">
              {motherName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>{motherName}</h3>

              <p>
                {getMotherPhone(caseItem) ||
                  "Contact information unavailable"}
              </p>
            </div>
          </div>

          <span
            className={`chw-priority-badge ${priority}`}
          >
            {priority === "high"
              ? "High priority"
              : priority === "medium"
                ? "Medium"
                : "Routine"}
          </span>
        </div>

        <div className="chw-case-divider" />

        <div className="chw-case-reason">
          <span>WHY THIS CASE NEEDS ATTENTION</span>

          <div className="chw-reason-row">
            {priority === "high" ? (
              <AlertCircle size={19} />
            ) : priority === "medium" ? (
              <Clock3 size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <p>{reason}</p>
          </div>
        </div>

        <div className="chw-case-action">
          <span>RECOMMENDED ACTION</span>

          <p>{recommendation}</p>
        </div>

        <button
          className="chw-case-button"
          onClick={() => openCase(caseItem)}
        >
          <span>View case</span>
          <ArrowRight size={17} />
        </button>

        <small className="chw-case-date">
          Updated {formatDate(caseItem.created_at)}
        </small>
      </article>
    );
  };

  if (loading) {
    return (
      <div className="chw-page-state">
        <div className="chw-state-icon">
          <HeartPulse size={25} />
        </div>

        <h2>Getting your cases ready</h2>

        <p>
          Loading the mothers assigned to you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chw-page-state">
        <div className="chw-state-icon error">
          <AlertCircle size={25} />
        </div>

        <h2>We couldn't load your cases</h2>

        <p>{error}</p>

        <button
          className="chw-primary-button"
          onClick={() => loadCases()}
        >
          Try again
          <RefreshCw size={17} />
        </button>
      </div>
    );
  }

  return (
    <div className="chw-dashboard">
      <header className="chw-header">
        <div className="chw-header-left">
          <button
            className="chw-mobile-menu"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="chw-brand">
            <MamlinziLogo/>
            <div>
              <strong>MaMlinzi</strong>
              <span>Community care</span>
            </div>
          </div>
        </div>

        <div className="chw-header-right">
          <div className="chw-user">
            <div className="chw-user-avatar">
              {profile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div className="chw-user-copy">
              <strong>
                {profile?.full_name ||
                  "Community Health Worker"}
              </strong>

              <span>Community Health Worker</span>
            </div>
          </div>

          <button
            className="chw-signout"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="chw-mobile-overlay">
          <div className="chw-mobile-menu-panel">
            <div className="chw-mobile-menu-header">
              <div className="chw-brand">
                <div className="chw-brand-mark">
                  <HeartPulse size={20} />
                </div>

                <strong>MaMlinzi</strong>
              </div>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="chw-mobile-links">
              <button
                className="active"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <Users size={19} />
                Dashboard
              </button>

              <button
                onClick={() =>
                  loadCases(true)
                }
              >
                <RefreshCw size={19} />
                Refresh cases
              </button>

              <button
                onClick={handleSignOut}
              >
                <LogOut size={19} />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="chw-main">
        <section className="chw-welcome">
          <div>
            <p className="chw-eyebrow">
              YOUR CARE WORKSPACE
            </p>

            <h1>
              Good day, {firstName}
            </h1>

            <p>
              Here are the mothers who may need
              your attention today.
            </p>
          </div>

          <button
            className="chw-refresh-button"
            onClick={() => loadCases(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "chw-spin"
                  : ""
              }
            />

            <span>
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </span>
          </button>
        </section>

        <section className="chw-summary">
          <div className="chw-summary-card total">
            <div className="chw-summary-icon">
              <Users size={21} />
            </div>

            <div>
              <span>ACTIVE MOTHERS</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="chw-summary-card high">
            <div className="chw-summary-icon">
              <AlertCircle size={21} />
            </div>

            <div>
              <span>NEED ATTENTION</span>
              <strong>{stats.high}</strong>
            </div>
          </div>

          <div className="chw-summary-card medium">
            <div className="chw-summary-icon">
              <Clock3 size={21} />
            </div>

            <div>
              <span>FOLLOW-UP</span>
              <strong>{stats.medium}</strong>
            </div>
          </div>

          <div className="chw-summary-card routine">
            <div className="chw-summary-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>ROUTINE</span>
              <strong>{stats.low}</strong>
            </div>
          </div>
        </section>

        <section className="chw-case-workspace">
          <div className="chw-section-header">
            <div>
              <p className="chw-eyebrow">
                PRIORITY CASES
              </p>

              <h2>
                Mothers needing your attention
              </h2>

              <p>
                Start with the highest-priority
                cases, then work through follow-ups.
              </p>
            </div>

            <div className="chw-case-count">
              {filteredCases.length}{" "}
              {filteredCases.length === 1
                ? "case"
                : "cases"}
            </div>
          </div>

          <div className="chw-tools">
            <div className="chw-search">
              <Search size={18} />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search mothers..."
                aria-label="Search mothers"
              />
            </div>

            <div className="chw-filters">
              <button
                className={
                  filter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </button>

              <button
                className={
                  filter === "high"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("high")
                }
              >
                High
              </button>

              <button
                className={
                  filter === "medium"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("medium")
                }
              >
                Medium
              </button>

              <button
                className={
                  filter === "low"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("low")
                }
              >
                Routine
              </button>
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="chw-empty">
              <div className="chw-empty-icon">
                <ShieldCheck size={25} />
              </div>

              <h3>No matching cases</h3>

              <p>
                Try another search or filter.
              </p>
            </div>
          ) : (
            <div className="chw-case-groups">
              {highCases.length > 0 && (
                <section className="chw-case-group">
                  <div className="chw-group-heading high">
                    <span>HIGH PRIORITY</span>
                    <strong>
                      {highCases.length}
                    </strong>
                  </div>

                  <div className="chw-case-grid">
                    {highCases.map(
                      renderCaseCard
                    )}
                  </div>
                </section>
              )}

              {mediumCases.length > 0 && (
                <section className="chw-case-group">
                  <div className="chw-group-heading medium">
                    <span>FOLLOW-UP NEEDED</span>
                    <strong>
                      {mediumCases.length}
                    </strong>
                  </div>

                  <div className="chw-case-grid">
                    {mediumCases.map(
                      renderCaseCard
                    )}
                  </div>
                </section>
              )}

              {lowCases.length > 0 && (
                <section className="chw-case-group">
                  <div className="chw-group-heading routine">
                    <span>ROUTINE</span>
                    <strong>
                      {lowCases.length}
                    </strong>
                  </div>

                  <div className="chw-case-grid">
                    {lowCases.map(
                      renderCaseCard
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CHWDashboard;