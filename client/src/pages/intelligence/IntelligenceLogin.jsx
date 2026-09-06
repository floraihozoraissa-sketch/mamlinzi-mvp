import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { supabase } from "../../services/supabase";
import "./intelligenceAuth.css";

function IntelligenceLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(
          loginError.message ||
            "Unable to sign in. Please check your details."
        );

        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", data.user.id)
          .single();

      if (profileError || !profile) {
        setError(
          "Could not load your MaMlinzi profile."
        );

        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (profile.role !== "health_official") {
        setError(
          "This account does not have access to the Intelligence Hub."
        );

        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      navigate("/intelligence");
    } catch (err) {
      console.error("INTELLIGENCE LOGIN ERROR:", err);

      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="intelligence-auth-page">
      {/* LEFT / BRAND PANEL */}
      <section className="intelligence-auth-brand">
        <div className="intelligence-brand-inner">
          <div className="intelligence-brand-logo">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>

          <span className="intelligence-brand-name">
            MaMlinzi
          </span>

          <div className="intelligence-brand-content">
            <span className="intelligence-eyebrow">
              MATERNAL INTELLIGENCE HUB
            </span>

            <h1>
              Understand what is
              happening across
              maternal care.
            </h1>

            <p>
              A trusted space for health
              programmes to monitor trends,
              review priorities, and support
              informed decisions.
            </p>
          </div>

          <div className="intelligence-brand-footer">
            <ShieldCheck size={17} />
            <span>
              Secure access for authorized
              health officials
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT / LOGIN PANEL */}
      <main className="intelligence-auth-main">
        <div className="intelligence-auth-card">
          <div className="intelligence-auth-heading">
            <div className="intelligence-mobile-logo">
              <ShieldCheck
                size={24}
                strokeWidth={2.2}
              />
            </div>

            <span className="intelligence-mobile-brand">
              MaMlinzi
            </span>

            <h2>Welcome back</h2>

            <p>
              Sign in to access the Maternal
              Intelligence Hub.
            </p>
          </div>

          <form
            className="intelligence-auth-form"
            onSubmit={handleLogin}
          >
            {/* EMAIL */}
            <div className="intelligence-field">
              <label htmlFor="intelligence-email">
                Email address
              </label>

              <div className="intelligence-input-wrapper">
                <Mail
                  size={19}
                  className="intelligence-input-icon"
                />

                <input
                  id="intelligence-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="intelligence-field">
              <label htmlFor="intelligence-password">
                Password
              </label>

              <div className="intelligence-input-wrapper">
                <LockKeyhole
                  size={19}
                  className="intelligence-input-icon"
                />

                <input
                  id="intelligence-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="intelligence-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div
                className="intelligence-auth-error"
                role="alert"
              >
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="intelligence-login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="intelligence-spinner"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Access Intelligence Hub
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* RESPONSIBLE AI */}
          <div className="intelligence-trust-note">
            <ShieldCheck size={18} />

            <div>
              <strong>
                Trusted decision support
              </strong>

              <p>
                MaMlinzi provides insights to
                support informed decisions.
                Qualified health professionals
                remain responsible for final
                decisions.
              </p>
            </div>
          </div>

          <p className="intelligence-auth-footer">
            Authorized access only
          </p>
        </div>
      </main>
    </div>
  );
}

export default IntelligenceLogin;