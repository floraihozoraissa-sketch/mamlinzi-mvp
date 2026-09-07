import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MamlinziLogo from "../components/MamlinziLogo";
import "./RoleSelection.css";

const roles = [
  {
    id: "mother",
    icon: HeartHandshake,
    title: "Mother",
    description:
      "Track your pregnancy, complete check-ins, and stay connected with your care team.",
    login: "/mother/login",
    register: "/mother/register",
    className: "role-mother",
  },
  {
    id: "chw",
    icon: UsersRound,
    title: "Community Health Worker",
    description:
      "Support mothers, review priority cases, and coordinate follow-up care.",
    login: "/chw/login",
    register: "/chw/register",
    className: "role-chw",
  },
  {
    id: "official",
    icon: ShieldCheck,
    title: "Health Official",
    description:
      "Understand maternal-care patterns and support better programme decisions.",
    login: "/intelligence/login",
    register: "/intelligence/register",
    className: "role-official",
  },
];

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <main className="role-page">
      <header className="role-header">
        <MamlinziLogo />
      </header>

      <section className="role-hero">
        <div className="role-hero-content">
          <span className="role-eyebrow">
            MATERNAL CARE • CONNECTION • ACTION
          </span>

          <h1>Welcome to MaMlinzi</h1>

          <p>
            A trusted digital companion connecting mothers,
            community health workers, and health programmes.
          </p>
        </div>
      </section>

      <section className="role-selection-section">
        <div className="role-section-heading">
          <h2>How will you use MaMlinzi?</h2>
          <p>
            Choose your role to continue to the experience designed
            for you.
          </p>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <article
                key={role.id}
                className={`role-card ${role.className}`}
              >
                <div className="role-icon">
                  <Icon size={25} strokeWidth={1.9} />
                </div>

                <div className="role-card-content">
                  <h3>{role.title}</h3>

                  <p>{role.description}</p>
                </div>

                <div className="role-card-actions">
                  <button
                    className="role-primary-button"
                    onClick={() => navigate(role.login)}
                  >
                    Sign in
                    <ArrowRight size={17} />
                  </button>

                  <button
                    className="role-secondary-button"
                    onClick={() => navigate(role.register)}
                  >
                    Create account
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="role-footer-note">
          Your role determines the MaMlinzi experience you see.
        </p>
      </section>
    </main>
  );
}

export default RoleSelection;