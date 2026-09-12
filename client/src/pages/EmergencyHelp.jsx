import {
  ArrowLeft,
  HeartHandshake,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";
import { Link, useState } from "react";
import { PublicHeader } from "./PublicSite";
import "./EmergencyHelp.css";

const emergencyContacts = [
  {
    number: "912",
    label: "Call Ambulance",
    description: "For urgent ambulance or emergency medical help.",
    primary: true,
  },
  {
    number: "112",
    label: "Call Emergency Services",
    description: "Rwanda emergency services.",
  },
  {
    number: "114",
    label: "Call Health Emergency Support",
    description: "Rwanda health emergency support.",
  },
];

function EmergencyHelp() {
  const [showChwNotice, setShowChwNotice] = useState(false);

  return (
    <main className="emergency-page">
      <PublicHeader />

      <section className="emergency-content" aria-labelledby="emergency-title">
        <Link className="emergency-back-link" to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to MaMlinzi
        </Link>

        <div className="emergency-intro">
          <div className="emergency-icon" aria-hidden="true">
            <ShieldAlert size={30} />
          </div>
          <p className="emergency-eyebrow">URGENT SUPPORT</p>
          <h1 id="emergency-title">Do you need urgent help?</h1>
          <p>
            If you believe you or your baby may be in immediate danger, seek
            emergency medical care now.
          </p>
        </div>

        <section className="emergency-actions" aria-labelledby="emergency-actions-title">
          <h2 id="emergency-actions-title">Call for help now</h2>
          <p className="emergency-action-note">
            Use the option that is right for your situation. These contacts
            are available before any MaMlinzi sign-in or registration.
          </p>

          <div className="emergency-contact-list">
            {emergencyContacts.map((contact) => (
              <a
                className={`emergency-contact ${contact.primary ? "primary" : ""}`}
                href={`tel:${contact.number}`}
                key={contact.number}
              >
                <span className="emergency-contact-icon" aria-hidden="true">
                  <PhoneCall size={21} />
                </span>
                <span className="emergency-contact-copy">
                  <strong>{contact.label}</strong>
                  <span>{contact.description}</span>
                </span>
                <span className="emergency-number">{contact.number}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="emergency-secondary" aria-labelledby="chw-help-title">
          <div className="emergency-secondary-heading">
            <HeartHandshake size={21} aria-hidden="true" />
            <h2 id="chw-help-title">I need help from my CHW</h2>
          </div>
          <p>
            MaMlinzi cannot currently dispatch emergency services or send an
            anonymous urgent request to a CHW.
          </p>
          <button
            type="button"
            className="emergency-secondary-button"
            onClick={() => setShowChwNotice((current) => !current)}
            aria-expanded={showChwNotice}
          >
            {showChwNotice ? "Hide information" : "Show support options"}
          </button>
          {showChwNotice && (
            <p className="emergency-chw-notice" role="status">
              Please use the emergency numbers above for immediate assistance.
              For ongoing support from your CHW, sign in to your MaMlinzi
              account after you are safe.
            </p>
          )}
        </section>

        <div className="emergency-safety-message" role="note">
          <ShieldAlert size={19} aria-hidden="true" />
          <p>
            If you are in immediate danger, do not wait for a response from
            MaMlinzi. Call emergency services or seek immediate medical care.
          </p>
        </div>
      </section>
    </main>
  );
}

export default EmergencyHelp;