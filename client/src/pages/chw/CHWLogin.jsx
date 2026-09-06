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
  CircleAlert,
  HeartPulse,
} from "lucide-react";

import { supabase } from "../../services/supabase";
import "./CHWLogin.css";

function CHWLogin() {
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
        setError("The email or password you entered is incorrect.");
        setLoading(false);
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error(
          "CHW PROFILE ERROR:",
          profileError
        );

        setError(
          "Could not load your MaMlinzi profile."
        );

        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (profile.role !== "chw") {
        setError(
          "This account is not registered as a Community Health Worker."
        );

        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      navigate("/chw");
    } catch (err) {
      console.error("CHW LOGIN ERROR:", err);

      setError(
        "Something went wrong while signing you in. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="chw-login-page">
      {/* Brand panel */}
      <section className="chw-login-brand">
        <div className="chw-login-brand-content">
          <div className="chw-login-logo">
            <HeartPulse size={22} strokeWidth={2.4} />
            <span>MaMlinzi</span>
          </div>

          <div className="chw-login-brand-main">
            <div className="chw-login-brand-icon">
              <ShieldCheck size={30} />
            </div>

            <p className="chw-login-brand-label">
              COMMUNITY HEALTH WORKER
            </p>

            <h1>
              Supporting you in caring for mothers.
            </h1>

            <p>
              Review priority cases, follow up with
              mothers, and keep care connected from one
              place.
            </p>
          </div>

          <div className="chw-login-brand-footer">
            <ShieldCheck size={17} />
            <span>
              Secure access for authorised CHWs
            </span>
          </div>
        </div>
      </section>

      {/* Login panel */}
      <main className="chw-login-main">
        <div className="chw-login-container">
          <div className="chw-login-mobile-logo">
            <div className="chw-login-mobile-logo-icon">
              <HeartPulse size={20} />
            </div>
            <span>MaMlinzi</span>
          </div>

          <div className="chw-login-heading">
            <p className="chw-login-eyebrow">
              CHW WORKSPACE
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your work with
              MaMlinzi.
            </p>
          </div>

          <form
            className="chw-login-form"
            onSubmit={handleLogin}
          >
            {/* Email */}
            <div className="chw-login-field">
              <label htmlFor="chw-email">
                Email address
              </label>

              <div className="chw-login-input-wrap">
                <Mail size={19} />

                <input
                  id="chw-email"
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

            {/* Password */}
            <div className="chw-login-field">
              <div className="chw-login-label-row">
                <label htmlFor="chw-password">
                  Password
                </label>
              </div>

              <div className="chw-login-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="chw-password"
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
                  className="chw-login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
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

            {/* Error */}
            {error && (
              <div
                className="chw-login-error"
                role="alert"
              >
                <CircleAlert size={18} />

                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="chw-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="chw-login-spinner"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="chw-login-security">
            <ShieldCheck size={17} />

            <div>
              <strong>Private workspace</strong>
              <span>
                Only authorised Community Health Workers
                can access assigned cases.
              </span>
            </div>
          </div>

          <p className="chw-login-footer">
            MaMlinzi · Maternal care coordination
          </p>
        </div>
      </main>
    </div>
  );
}

export default CHWLogin;