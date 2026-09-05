import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function IntelligenceLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setError("Could not load your MaMlinzi profile.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.role !== "health_official") {
      setError(
        "This account does not have Intelligence Hub access."
      );

      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/intelligence");
  };

  return (
    <div>
      <h1>MaMlinzi Intelligence Hub</h1>

      <p>
        Sign in to access maternal health insights.
      </p>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Official email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <br />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default IntelligenceLogin;