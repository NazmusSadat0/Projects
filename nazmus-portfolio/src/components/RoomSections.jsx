import { useEffect, useRef, useState } from "react";

// PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT URL HERE:
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwxiOk4ab3xeSIqsMYo6O20OK7jipUdhVQuVgMKtGD79QUKSODxL27oo6xDqO1gaii-Zw/exec";

const projects = [
  {
    title: "KUET Empty Room",
    text: "A campus space booking project.",
    tags: "React · Supabase",
    live: "",
    github: "",
  },
  {
    title: "Farm Management",
    text: "A farm management interface.",
    tags: "React",
    live: "",
    github: "",
  },
];

const contact = {
  email: "nazmussadat2120@gmail.com", // 
  github: "https://github.com/NazmusSadat0",
  githubHandle: "@NazmusSadat0",
  linkedin: "https://www.linkedin.com/in/nazmus-sadat-76b951278/",
  linkedinHandle: "Nazmus Sadat",
  whatsapp: "https://wa.me/8801613974734",
  whatsappDisplay: "+880 1613-974734",
  location: "Khulna / Dhaka, BD",
};

const titles = {
  projects: "Selected Projects",
  about: "About Me",
  contact: "Let’s Talk",
  guestbook: "Studio Guestbook & Reviews",
};

export default function RoomSections({ section, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) {
      element.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog portfolio-dialog--fullscreen"
      aria-labelledby="section-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close();
        }
      }}
    >
      <div className="portfolio-fullscreen-container">
        {/* Full-width sticky header */}
        <header className="portfolio-fullscreen-header">
          <div className="portfolio-header-brand">
            <span className="portfolio-eyebrow">NAZMUS / {section.toUpperCase()}</span>
            <h1 id="section-title">{titles[section]}</h1>
          </div>

          <button
            type="button"
            className="portfolio-fullscreen-close"
            onClick={() => dialog.current.close()}
            aria-label="Close page"
            autoFocus
          >
            <span>Close</span>
            <span className="portfolio-close-cross">×</span>
          </button>
        </header>

        {/* Full-width content wrapper */}
        <main className="portfolio-fullscreen-body">
          {section === "projects" && (
            <div className="portfolio-projects-grid">
              {projects.map((project, index) => (
                <article className="portfolio-project-card" key={project.title}>
                  <div className="portfolio-project-header">
                    <span className="portfolio-project-number">0{index + 1}</span>
                    <small className="portfolio-project-tag">{project.tags}</small>
                  </div>

                  <h2>{project.title}</h2>
                  <p>{project.text}</p>

                  <div className="portfolio-links">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer">
                        Live project ↗
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer">
                        Source code ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {section === "about" && (
            <div className="portfolio-about-view">
              <div className="portfolio-about-hero">
                <p className="portfolio-lead">
                  I’m Nazmus, a Computer Science & Engineering student at Khulna University
                  of Engineering & Technology (KUET).
                </p>
                <p>
                  I specialize in full-stack web applications, 3D interactive experiences, and
                  AI automation workflows.
                </p>

                <div className="portfolio-tags">
                  <span>React</span>
                  <span>Three.js</span>
                  <span>Next.js</span>
                  <span>Node.js</span>
                  <span>C / C++</span>
                  <span>AI Automation</span>
                  <span>Supabase</span>
                </div>
              </div>
            </div>
          )}

          {section === "contact" && <ContactFullPage />}


          {section === "guestbook" && <GuestbookFullPage />}
        </main>
      </div>
    </dialog>
  );
}

function GuestbookFullPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!GOOGLE_SHEET_URL.startsWith("http") || GOOGLE_SHEET_URL.includes("YOUR_SCRIPT_ID")) {
      setLoading(false);
      return;
    }

    fetch(GOOGLE_SHEET_URL)
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setStatus("sending");

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(form),
      });

      setReviews((prev) => [
        {
          ...form,
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);

      setForm({ name: "", rating: 5, message: "" });
      setStatus("success");
    } catch (err) {
      console.error("Submission failed:", err);
      setStatus("error");
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="guestbook-fullscreen-layout">
      {/* Left Column: Form & Stats */}
      <div className="guestbook-sidebar">
        <div className="guestbook-rating-summary">
          <div className="summary-score">{averageRating}</div>
          <div className="summary-meta">
            <div className="summary-stars">★★★★★</div>
            <span>Based on {reviews.length} community notes</span>
          </div>
        </div>

        <form className="guestbook-form-card" onSubmit={handleSubmit}>
          <h3>Sign the Guestbook</h3>
          <p>Leave a review, share feedback, or say hello.</p>

          <div className="form-group">
            <label htmlFor="gb-name">Your Name *</label>
            <input
              id="gb-name"
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Rating / Vibe</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= form.rating ? "star-active" : ""}
                  onClick={() => setForm({ ...form, rating: star })}
                  aria-label={`${star} star rating`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gb-msg">Review / Feedback *</label>
            <textarea
              id="gb-msg"
              rows="4"
              required
              placeholder="Love the 3D room and interactions..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="guestbook-submit-btn"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Saving to Google Sheet..."
              : status === "success"
                ? "Note Recorded ✓"
                : "Submit Review →"}
          </button>

          {status === "error" && (
            <p className="form-error-hint">Failed to submit. Check your Google Apps Script URL.</p>
          )}
        </form>
      </div>

      {/* Right Column: Wall of Reviews */}
      <div className="guestbook-wall">
        <h2>Recent Reviews ({reviews.length})</h2>

        {loading ? (
          <div className="guestbook-loading">Fetching reviews from Google Sheets...</div>
        ) : reviews.length === 0 ? (
          <div className="guestbook-empty">
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="guestbook-feed-grid">
            {reviews.map((rev, index) => (
              <article className="guestbook-review-card" key={index}>
                <div className="card-top">
                  <div className="card-user">
                    <strong>{rev.name}</strong>
                  </div>
                  <div className="card-stars">{"★".repeat(rev.rating || 5)}</div>
                </div>

                <p className="card-body">{rev.message}</p>
                {rev.date && <time className="card-date">{rev.date}</time>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const INQUIRY_TOPICS = [
  "AI Automation",
  "Full-Stack Web",
  "3D / WebGL",
  "General / Role",
];

function ContactFullPage() {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [topic, setTopic] = useState("AI Automation");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  // Live ticking UTC+6 clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setLocalTime(formatted);
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  function copyEmail() {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus("sending");
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          type: "contact",
          name: form.name,
          email: form.email,
          message: `[${topic}] ${form.message}`,
        }),
      });
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="contact-console-grid">
      {/* Left Column: Visual Studio Telemetry & Channels */}
      <div className="contact-visual-col">
        {/* Live Studio Radar & Timezone Card */}
        <div className="studio-telemetry-card">
          <div className="telemetry-radar" aria-hidden="true">
            <span className="radar-ring radar-ring--1" />
            <span className="radar-ring radar-ring--2" />
            <span className="radar-sweep" />
            <span className="radar-center-dot" />
          </div>

          <div className="telemetry-meta">
            <div className="telemetry-badge">
              <span className="status-dot" />
              <span>ONLINE · OPEN FOR PROJECTS</span>
            </div>
            <h2>{contact.location}</h2>
            <div className="telemetry-clock">
              <span>LOCAL STUDIO TIME (UTC+6)</span>
              <strong>{localTime || "12:00:00 PM"}</strong>
            </div>
          </div>
        </div>

        {/* Direct Email Spotlight Card */}
        <div className="channel-spotlight-card">
          <div className="channel-spotlight-top">
            <div className="channel-icon-wrap channel-icon-wrap--gold">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M3.5 6.5L12 13L20.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="channel-tag">DIRECT LINE</span>
          </div>

          <div className="channel-spotlight-body">
            <span>Drop an email anytime</span>
            <strong>{contact.email}</strong>
          </div>

          <div className="channel-spotlight-actions">
            <button
              type="button"
              className="spotlight-btn spotlight-btn--primary"
              onClick={copyEmail}
            >
              <svg viewBox="0 0 18 18" fill="none">
                <rect
                  x="6"
                  y="6"
                  width="9"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 6V4.5C12 3.67 11.33 3 10.5 3H4.5C3.67 3 3 3.67 3 4.5V10.5C3 11.33 3.67 12 4.5 12H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span>{copied ? "Copied to Clipboard ✓" : "Copy Address"}</span>
            </button>

            <a
              href={`mailto:${contact.email}`}
              className="spotlight-btn spotlight-btn--ghost"
            >
              <span>Open Mail App ↗</span>
            </a>
          </div>
        </div>

        {/* Branded Social Cards */}
        {/* Branded Social & Instant Chat Cards */}
        <div className="channel-social-row">
          {contact.linkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="social-visual-card"
            >
              <div className="channel-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 8C17.59 8 19.12 8.63 20.24 9.76C21.37 10.88 22 12.41 22 14V21H18V14C18 13.47 17.79 12.96 17.41 12.59C17.04 12.21 16.53 12 16 12C15.47 12 14.96 12.21 14.59 12.59C14.21 12.96 14 13.47 14 14V21H10V14C10 12.41 10.63 10.88 11.76 9.76C12.88 8.63 14.41 8 16 8Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </div>
              <div className="social-card-copy">
                <span>LinkedIn</span>
                <strong>{contact.linkedinHandle} ↗</strong>
              </div>
            </a>
          )}

          {contact.github && (
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="social-visual-card"
            >
              <div className="channel-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 22V18C15.14 16.75 14.78 15.49 14 14.5C17 14.5 20 12.5 20 9C20.08 7.75 19.73 6.52 19 5.5C19.28 4.35 19.28 3.15 19 2C19 2 18 2 16 3.5C13.36 3 10.64 3 8 3.5C6 2 5 2 5 2C4.7 3.15 4.7 4.35 5 5.5C4.27 6.52 3.92 7.75 4 9C4 12.5 7 14.5 10 14.5C9.39 15.18 9.03 16.05 9 17V22"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 18C4.49 20 4 16 2 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>
              <div className="social-card-copy">
                <span>GitHub</span>
                <strong>{contact.githubHandle} ↗</strong>
              </div>
            </a>
          )}

          {contact.whatsapp && (
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="social-visual-card social-visual-card--full"
            >
              <div className="channel-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 11.5C21 16.47 16.97 20.5 12 20.5C10.46 20.5 9.01 20.11 7.74 19.42L3 21L4.62 16.38C3.89 14.92 3 13.26 3 11.5C3 6.53 7.03 2.5 12 2.5C16.97 2.5 21 6.53 21 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="social-card-copy">
                <span>WhatsApp Direct</span>
                <strong>{contact.whatsappDisplay || "Chat on WhatsApp"} ↗</strong>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Interactive Dispatch Console */}
      <form className="dispatch-console-card" onSubmit={handleContactSubmit}>
        <div className="console-header">
          <div className="console-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="console-title">DISPATCH // NEW_INQUIRY.SH</span>
        </div>

        <div className="console-body">
          <h3>Initiate a Conversation</h3>
          <p>Select a topic below and send a direct transmission to my inbox.</p>

          {/* Interactive Topic Selector Chips */}
          <div className="form-group">
            <label>01 / What are we building?</label>
            <div className="topic-chip-group" role="radiogroup">
              {INQUIRY_TOPICS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    "topic-chip",
                    topic === item ? "topic-chip--active" : "",
                  ].join(" ")}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="console-input-row">
            <div className="form-group">
              <label htmlFor="ct-name">02 / Your Name *</label>
              <input
                id="ct-name"
                type="text"
                required
                placeholder="Alex Rivera"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ct-email">03 / Your Email *</label>
              <input
                id="ct-email"
                type="email"
                required
                placeholder="alex@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ct-msg">04 / Project Brief or Message *</label>
            <textarea
              id="ct-msg"
              rows="4"
              required
              placeholder="Tell me about your timeline, goals, or the workflow you want to automate..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="dispatch-submit-btn"
            disabled={status === "sending"}
          >
            <span>
              {status === "sending"
                ? "Transmitting to Studio..."
                : status === "success"
                  ? "Transmission Received ✓"
                  : "Send Transmission"}
            </span>
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {status === "error" && (
            <p className="form-error-hint">
              Transmission failed. Please copy my email on the left!
            </p>
          )}
        </div>
      </form>
    </div>
  );
}