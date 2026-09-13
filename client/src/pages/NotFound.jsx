import { ArrowLeft, Compass, Home, Siren } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MaMlinziLogo from "../components/MaMlinziLogo";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <header className="not-found-header">
        <Link className="not-found-brand" to="/" aria-label="MaMlinzi home">
          <MaMlinziLogo compact />
          <span>MaMlinzi</span>
        </Link>
        <Link className="not-found-emergency" to="/emergency">
          <Siren size={17} aria-hidden="true" />
          Emergency help
        </Link>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-mark" aria-hidden="true">
          <Compass size={34} />
        </div>
        <p className="not-found-code">404</p>
        <h1 id="not-found-title">We couldn’t find that page.</h1>
        <p>
          The link may be out of date, or the page may have moved. Let’s get
          you back to a familiar place.
        </p>
        <div className="not-found-actions">
          <Link className="not-found-home" to="/">
            <Home size={18} aria-hidden="true" />
            Go to home
          </Link>
          <button type="button" className="not-found-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} aria-hidden="true" />
            Go back
          </button>
        </div>
        <p className="not-found-note">
          Need urgent help? Emergency contacts are always available without signing in.
        </p>
      </section>
    </main>
  );
}

export default NotFound;
