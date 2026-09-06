import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

import "./MotherHelp.css";

function MotherHelp() {
  return (
    <div className="mother-help-page">
      <header className="mother-help-header">
        <div>
          <span className="mother-help-eyebrow">
            SUPPORT
          </span>

          <h1>How can we help?</h1>

          <p>
            Find answers, understand your care journey,
            and know where to turn when you need support.
          </p>
        </div>

        <div className="mother-help-header-icon">
          <CircleHelp size={28} />
        </div>
      </header>

      <main className="mother-help-content">

        {/* CHW SUPPORT */}
        <section className="mother-help-card mother-help-card-primary">
          <div className="mother-help-card-icon">
            <MessageCircle size={22} />
          </div>

          <div className="mother-help-card-content">
            <span className="mother-help-label">
              YOUR CARE TEAM
            </span>

            <h2>Talk to your CHW</h2>

            <p>
              Your community health worker can help you
              understand your follow-up and what to do next.
            </p>

            <a href="/mother/journey">
              View my care journey
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="mother-help-card">
          <div className="mother-help-card-icon teal">
            <BookOpen size={22} />
          </div>

          <div className="mother-help-card-content">
            <span className="mother-help-label">
              PREGNANCY SUPPORT
            </span>

            <h2>Learn about your pregnancy</h2>

            <p>
              Get simple information to help you understand
              pregnancy care and prepare for your appointments.
            </p>

            <div className="mother-help-topics">
              <span>Pregnancy care</span>
              <span>Appointments</span>
              <span>Warning signs</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mother-help-section">
          <div className="mother-help-section-heading">
            <CircleHelp size={21} />

            <h2>Common questions</h2>
          </div>

          <details>
            <summary>
              What happens after I complete a check-in?
            </summary>

            <p>
              Your information is reviewed through MaMlinzi.
              If follow-up is needed, your care team can
              review it and contact you.
            </p>
          </details>

          <details>
            <summary>
              Who can see my information?
            </summary>

            <p>
              Your information is handled within the
              MaMlinzi care workflow and should only be
              accessible to authorized users.
            </p>
          </details>

          <details>
            <summary>
              How do I know when my CHW has followed up?
            </summary>

            <p>
              Your care journey will show when a follow-up
              has been recorded and will display the update
              provided by your CHW.
            </p>
          </details>
        </section>

        {/* URGENT SUPPORT */}
        <section className="mother-help-urgent">
          <div className="mother-help-urgent-icon">
            <PhoneCall size={21} />
          </div>

          <div>
            <h2>Need urgent medical care?</h2>

            <p>
              If you feel seriously unwell or believe you
              have an emergency, seek appropriate medical
              care immediately.
            </p>
          </div>
        </section>

        {/* TRUST */}
        <div className="mother-help-trust">
          <ShieldCheck size={19} />

          <p>
            MaMlinzi provides support based on information
            you record. It does not replace care from a
            qualified healthcare professional.
          </p>
        </div>

      </main>
    </div>
  );
}

export default MotherHelp;