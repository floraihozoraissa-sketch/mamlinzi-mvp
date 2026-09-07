import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CHWAuth.css";


function CHWRegistration() {
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
            role: "chw",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setSuccess(
        "Your CHW account has been created. You can now sign in."
      );

      setTimeout(() => {
        navigate("/chw/login");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="chw-auth-page">
      <div className="chw-auth-shell">
        <button
          className="chw-back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <section className="chw-auth-card">
          <div className="chw-auth-icon">
            <UsersRound size={25} />
          </div>

          <h1>Create CHW account</h1>

          <p className="chw-auth-subtitle">
            Create an account to support mothers and coordinate
            follow-up care.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <div className="chw-input-wrapper">
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
              <div className="chw-input-wrapper">
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
              <div className="chw-input-wrapper">
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
              <div className="chw-input-wrapper">
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
                  className="chw-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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
              <div className="chw-auth-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="chw-auth-message success">
                {success}
              </div>
            )}

            <button
              className="chw-auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="chw-auth-switch">
            Already have an account?{" "}
            <button onClick={() => navigate("/chw/login")}>
              Sign in
            </button>
          </p>

          <p className="chw-verification-note">
            CHW accounts may require verification by the
            responsible health programme.
          </p>
        </section>
      </div>
    </main>
  );
}

export default CHWRegistration;