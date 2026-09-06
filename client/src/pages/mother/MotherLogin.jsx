import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import "./MotherAuth.css";

function MotherLogin() {
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

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", data.user.id)
        .single();

    if (profileError) {
      console.error("PROFILE ERROR:", profileError);
      setError("Could not load your MaMlinzi profile.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.role !== "mother") {
      setError("This account is not registered as a mother.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/mother");
  };

  return (
    <main className="mother-auth-page">
      <section className="mother-auth-card">
        <div className="mother-auth-brand">
          <div className="mother-auth-logo">
            <HeartPulse size={24} strokeWidth={2.2} />
          </div>

          <span>MaMlinzi</span>
        </div>

        <div className="mother-auth-intro">
          <p className="mother-auth-eyebrow">
            Maternal health support
          </p>

          <h1>Welcome back</h1>

          <p>
            Your pregnancy support is here whenever you need it.
          </p>
        </div>

        <form
          className="mother-auth-form"
          onSubmit={handleLogin}
        >
          <div className="mother-field">
            <label htmlFor="email">Email address</label>

            <div className="mother-input-wrapper">
              <Mail size={19} aria-hidden="true" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="mother-field">
            <div className="mother-field-label-row">
              <label htmlFor="password">Password</label>
            </div>

            <div className="mother-input-wrapper">
              <LockKeyhole size={19} aria-hidden="true" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((current) => !current)
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

          {error && (
            <div
              className="mother-auth-message mother-auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mother-primary-button"
            disabled={loading}
          >
            <span>
              {loading ? "Signing in..." : "Sign in"}
            </span>

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mother-auth-footer">
          <span>New to MaMlinzi?</span>

          <button
            type="button"
            onClick={() => navigate("/mother/register")}
          >
            Create an account
          </button>
        </div>

        <p className="mother-auth-trust">
          Your information is handled securely and used to
          support your maternal health journey.
        </p>
      </section>
    </main>
  );
}

export default MotherLogin;