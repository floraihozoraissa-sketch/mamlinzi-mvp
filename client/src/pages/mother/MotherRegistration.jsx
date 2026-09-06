import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import "./MotherAuth.css";

function MotherRegistration() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(
        "Your account was created successfully. You can now sign in."
      );

      setTimeout(() => {
        navigate("/mother/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        "Could not connect to the MaMlinzi server."
      );
    }

    setLoading(false);
  };

  return (
    <main className="mother-auth-page">
      <section className="mother-auth-card mother-register-card">
        <div className="mother-auth-brand">
          <div className="mother-auth-logo">
            <HeartPulse size={24} strokeWidth={2.2} />
          </div>

          <span>MaMlinzi</span>
        </div>

        <div className="mother-auth-intro">
          <p className="mother-auth-eyebrow">
            Start your journey
          </p>

          <h1>Create your account</h1>

          <p>
            Join MaMlinzi for simple, supportive pregnancy
            health guidance.
          </p>
        </div>

        <form
          className="mother-auth-form"
          onSubmit={handleRegister}
        >
          <div className="mother-field">
            <label htmlFor="fullName">Full name</label>

            <div className="mother-input-wrapper">
              <UserRound size={19} aria-hidden="true" />

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="mother-field">
            <label htmlFor="email">Email address</label>

            <div className="mother-input-wrapper">
              <Mail size={19} aria-hidden="true" />

              <input
                id="email"
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

          <div className="mother-field">
            <label htmlFor="phone">Phone number</label>

            <div className="mother-input-wrapper">
              <Phone size={19} aria-hidden="true" />

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="+250 7XX XXX XXX"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>

            <span className="mother-field-hint">
              Use a number where your community health worker
              can reach you.
            </span>
          </div>

          <div className="mother-field">
            <label htmlFor="password">Create a password</label>

            <div className="mother-input-wrapper">
              <LockKeyhole size={19} aria-hidden="true" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
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

          {success && (
            <div
              className="mother-auth-message mother-auth-success"
              role="status"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="mother-primary-button"
            disabled={loading}
          >
            <span>
              {loading
                ? "Creating account..."
                : "Create account"}
            </span>

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mother-auth-footer">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/mother/login")}
          >
            Sign in
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

export default MotherRegistration;