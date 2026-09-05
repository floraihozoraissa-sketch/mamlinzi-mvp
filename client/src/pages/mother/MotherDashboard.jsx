import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function MotherDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/mother/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .single();

      if (error || data?.role !== "mother") {
        await supabase.auth.signOut();
        navigate("/mother/login");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/mother/login");
  };

  if (loading) {
    return <p>Loading your MaMlinzi account...</p>;
  }

  return (
    <div>
      <h1>Welcome, {profile.full_name}</h1>

      <p>
        MaMlinzi is here to help you stay connected with your maternal
        healthcare journey.
      </p>

      <button onClick={() => navigate("/mother/checkin")}>
        Start Health Check-in
      </button>

      <button onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}

export default MotherDashboard;