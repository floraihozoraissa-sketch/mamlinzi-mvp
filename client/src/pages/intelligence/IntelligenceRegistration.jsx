import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicHeader } from "../PublicSite";
import "./IntelligenceAuth.css";


function IntelligenceRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      setError("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            role: "health_official",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setSuccess(
        "Your official account has been created. You can now sign in."
      );

      setTimeout(() => {
        navigate("/intelligence/login");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="intelligence-auth-page intelligence-registration-page">
      <PublicHeader />
      <div className="intelligence-auth-shell">
        <button
          className="intelligence-back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <section className="intelligence-auth-card">
          <div className="intelligence-auth-icon">
            <ShieldCheck size={25} />
          </div>

          <h1>Create official account</h1>

          <p className="intelligence-auth-subtitle">
            Create an account for programme-level maternal health
            intelligence.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <div className="intelligence-input-wrapper">
                <UserRound size={18} />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </label>

            <label>
              Email
              <div className="intelligence-input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label>
              Phone number
              <div className="intelligence-input-wrapper">
                <Phone size={18} />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07..."
                />
              </div>
            </label>

            <label>
              Password
              <div className="intelligence-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="intelligence-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="intelligence-auth-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="intelligence-auth-message success">
                {success}
              </div>
            )}

            <button
              className="intelligence-auth-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="intelligence-auth-spinner"
                    aria-hidden="true"
                  />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="intelligence-auth-switch">
            Already have an account?{" "}
            <button
              onClick={() =>
                navigate("/intelligence/login")
              }
            >
              Sign in
            </button>
          </p>

          <p className="intelligence-verification-note">
            Official accounts should be used by authorized
            programme or health-system personnel.
          </p>
        </section>
      </div>
    </main>
  );
}

export default IntelligenceRegistration;