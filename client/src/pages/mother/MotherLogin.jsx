import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function MotherLogin() {
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
    <div>
      <h1>MaMlinzi Mother Login</h1>

      <form onSubmit={handleLogin}>
        <div>
  <label>Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    required
  />
</div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default MotherLogin;