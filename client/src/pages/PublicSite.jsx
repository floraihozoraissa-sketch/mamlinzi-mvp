import { ArrowRight, HeartHandshake, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MaMlinziLogo from "../components/MaMlinziLogo";
import "./PublicSite.css";

export function PublicHeader() {
    const navigate = useNavigate();

    return (
        <header className="public-header">
            <Link className="public-brand" to="/" aria-label="MaMlinzi home">
                <MaMlinziLogo compact />
                <span>MaMlinzi</span>
            </Link>
            <nav className="public-nav" aria-label="Public navigation">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <button className="public-nav-signup" onClick={() => navigate("/signup")}>Sign up</button>
                <button className="public-nav-login" onClick={() => navigate("/mother/login")}>Log in</button>
            </nav>
        </header>
    );
}

function PublicSite() {
    return (
        <main className="public-site">
            <PublicHeader />
            <section className="public-hero">
                <div className="public-hero-copy">
                    <p className="public-eyebrow">MATERNAL CARE | CONNECTION | ACTION</p>
                    <h1>Supporting safer maternal care through timely information and follow-up.</h1>
                    <p className="public-lead">MaMlinzi connects mothers, community health workers, and health programmes so the right people can stay informed and connected.</p>
                    <div className="public-actions">
                        <Link className="public-primary-action" to="/signup">Get started <ArrowRight size={18} /></Link>
                        <Link className="public-secondary-action" to="/mother/login">Sign in</Link>
                    </div>
                    <p className="public-disclaimer"><ShieldCheck size={17} /> MaMlinzi provides digital decision support. Healthcare professionals remain responsible for clinical decisions.</p>
                </div>
                <div className="public-hero-panel" aria-label="MaMlinzi connects care teams">
                    <div className="public-panel-mark"><HeartHandshake size={34} /></div>
                    <span>One connected care picture</span>
                    <strong>Information that helps teams follow up sooner.</strong>
                    <div className="public-panel-flow"><span>Mother</span><ArrowRight size={16} /><span>CHW</span><ArrowRight size={16} /><span>Programme</span></div>
                </div>
            </section>
            <section className="public-section public-section-light">
                <div className="public-section-heading"><p className="public-eyebrow">HOW IT WORKS</p><h2>Simple support for every part of the care journey.</h2></div>
                <div className="public-feature-grid">
                    <article><div className="public-feature-icon"><HeartHandshake size={22} /></div><h3>Mothers stay informed</h3><p>Complete check-ins, understand the next step, and stay connected with your care team.</p></article>
                    <article><div className="public-feature-icon teal"><UsersRound size={22} /></div><h3>CHWs see what needs attention</h3><p>Review assigned cases and coordinate follow-up using the information already available to your team.</p></article>
                    <article><div className="public-feature-icon gold"><ShieldCheck size={22} /></div><h3>Programmes see patterns</h3><p>Health officials can use aggregated information to understand activity and plan support.</p></article>
                </div>
            </section>
            <section className="public-oversight"><div><p className="public-eyebrow">RESPONSIBLE SUPPORT</p><h2>Technology should strengthen human care.</h2></div><p>MaMlinzi does not diagnose medical conditions or replace a qualified healthcare professional. It helps organise information and make follow-up easier to coordinate.</p></section>
            <footer className="public-footer"><span>© MaMlinzi</span><Link to="/contact"><Mail size={16} /> Contact the team</Link></footer>
        </main>
    );
}

export function PublicInfo({ type }) {
    const isAbout = type === "about";
    return <main className="public-site"><PublicHeader /><section className="public-info-page"><p className="public-eyebrow">{isAbout ? "ABOUT MAMLINZI" : "CONTACT US"}</p><h1>{isAbout ? "A clearer way to keep maternal support connected." : "Let us help you get connected."}</h1><p>{isAbout ? "MaMlinzi is a maternal-health support application for mothers, community health workers, and health programmes. It organises check-ins, follow-up, and programme information in one place." : "For account or programme support, contact the team responsible for your MaMlinzi programme. Your local health programme can also help you with access and follow-up."}</p>{isAbout && <p className="public-note"><ShieldCheck size={18} /> General pregnancy information and digital decision support are educational and do not replace personal medical advice.</p>}{!isAbout && <p className="public-note"><Mail size={18} /> Contact details are managed by your local health programme so support reaches the right team.</p>}</section></main>;
}

export default PublicSite;
