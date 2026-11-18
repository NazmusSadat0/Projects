import { useEffect, useRef, useState } from "react";
import sadatImg from "../assets/Sadat.jpeg";

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

          {section === "projects" && <ProjectsFullPage />}

          {section === "about" && (
            <AboutFullPage onNavigate={onClose} />
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

const TECH_ARSENAL = [
  {
    name: "C",
    domain: "systems",
    level: "92%",
    color: "#5c8dbc",
    icon: "https://cdn.simpleicons.org/c/5c8dbc",
  },
  {
    name: "C++",
    domain: "systems",
    level: "88%",
    color: "#00599C",
    icon: "https://cdn.simpleicons.org/cplusplus/00599C",
  },
  {
    name: "Python",
    domain: "ai",
    level: "90%",
    color: "#FFD43B",
    icon: "https://cdn.simpleicons.org/python/FFD43B",
  },
  {
    name: "JavaScript",
    domain: "web",
    level: "94%",
    color: "#F7DF1E",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
  },
  {
    name: "React",
    domain: "web",
    level: "95%",
    color: "#61DAFB",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
  },
  {
    name: "Next.js",
    domain: "web",
    level: "88%",
    color: "#ffffff",
    icon: "https://cdn.simpleicons.org/nextdotjs/ffffff",
  },
  {
    name: "Three.js / R3F",
    domain: "web",
    level: "86%",
    color: "#e0b68a",
    icon: "https://cdn.simpleicons.org/threedotjs/e0b68a",
  },
  {
    name: "Vite",
    domain: "web",
    level: "92%",
    color: "#646CFF",
    icon: "https://cdn.simpleicons.org/vite/646CFF",
  },
  {
    name: "Node.js",
    domain: "backend",
    level: "89%",
    color: "#5FA04E",
    icon: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
  },
  {
    name: "n8n Workflows",
    domain: "ai",
    level: "96%",
    color: "#EA4B71",
    icon: "https://cdn.simpleicons.org/n8n/EA4B71",
  },
  {
    name: "Supabase",
    domain: "backend",
    level: "91%",
    color: "#3ECF8E",
    icon: "https://cdn.simpleicons.org/supabase/3ECF8E",
  },
  {
    name: "Firebase",
    domain: "backend",
    level: "87%",
    color: "#DD2C00",
    icon: "https://cdn.simpleicons.org/firebase/FFCA28",
  },
  {
    name: "Docker",
    domain: "backend",
    level: "84%",
    color: "#2496ED",
    icon: "https://cdn.simpleicons.org/docker/2496ED",
  },
  {
    name: "Git & GitHub",
    domain: "systems",
    level: "94%",
    color: "#F05032",
    icon: "https://cdn.simpleicons.org/git/F05032",
  },
];

const DOMAIN_FILTERS = [
  { id: "all", label: "All Systems (14)" },
  { id: "ai", label: "AI & Automation" },
  { id: "web", label: "3D & Frontend" },
  { id: "backend", label: "Backend & Cloud" },
  { id: "systems", label: "Low-Level / Core" },
];

function AboutFullPage() {
  const [activeDomain, setActiveDomain] = useState("all");

  const filteredStack =
    activeDomain === "all"
      ? TECH_ARSENAL
      : TECH_ARSENAL.filter((item) => item.domain === activeDomain);

  return (
    <div className="about-cyber-showcase">
      {/* 1. HERO ROW: Holographic Avatar Scanner + Animated Kinetic Headline */}
      <div className="about-hero-deck">
        {/* Left: Animated Hologram Portrait Frame */}
        <div className="holo-avatar-card">
          <div className="holo-orbit-ring holo-orbit-ring--outer" aria-hidden="true" />
          <div className="holo-orbit-ring holo-orbit-ring--inner" aria-hidden="true" />

          <div className="holo-image-frame">
            <img src={sadatImg} alt="Nazmus Sadat" className="holo-photo" />
            <span className="holo-laser-scan" aria-hidden="true" />
            <div className="holo-corner holo-corner--tl" />
            <div className="holo-corner holo-corner--tr" />
            <div className="holo-corner holo-corner--bl" />
            <div className="holo-corner holo-corner--br" />
          </div>

          <div className="holo-identity-footer">
            <div className="holo-status-chip">
              <span className="status-dot" />
              <span>SYS_ACTIVE // KUET_2K25</span>
            </div>
            <h3>Nazmus Sadat</h3>
            <p>Founder of Fillara AI · Full-Stack & AI Engineer</p>
          </div>
        </div>

        {/* Right: Kinetic Visual Typography & Live Architecture Diagram */}
        <div className="about-kinetic-panel">
          <div className="kinetic-badge-row">
            <span className="cyber-pill cyber-pill--gold">
              ⚡ FOUNDER @ FILLARA AI
            </span>
            <span className="cyber-pill cyber-pill--green">
              🎓 CSE UNDERGRAD @ KUET
            </span>
            <span className="cyber-pill">🌐 FULL-STACK ARCHITECT</span>
          </div>

          <h2 className="kinetic-display-title">
            Engineering <span className="gradient-stroke-text">Autonomous AI</span>{" "}
            &amp; High-Velocity{" "}
            <span className="shimmer-gold-text">3D Web Systems.</span>
          </h2>

          <p className="kinetic-lead-copy">
            I’m <strong>Nazmus Sadat</strong>—bridging raw{" "}
            <span className="inline-code-chip">C / C++</span> memory-level
            fundamentals from <strong>KUET CSE</strong> with production{" "}
            <span className="inline-code-chip">RAG Pipelines</span>,{" "}
            <span className="inline-code-chip">n8n AI Agents</span>, and spatial{" "}
            <span className="inline-code-chip">React + Three.js</span>{" "}
            experiences.
          </p>

          {/* Animated SVG Neural / Pipeline Visualizer */}
          <div className="pipeline-visualizer-card">
            <div className="pipeline-header">
              <span>LIVE ARCHITECTURE PIPELINE // FILLARA_ENGINE</span>
              <span className="pipeline-pulse-tag">● REAL-TIME FLOW</span>
            </div>

            <svg
              viewBox="0 0 680 110"
              fill="none"
              className="pipeline-svg"
              aria-hidden="true"
            >
              {/* Animated connecting tracks */}
              <path
                d="M115 55 H295 M385 55 H565"
                stroke="rgba(224, 182, 138, 0.22)"
                strokeWidth="2"
              />
              <path
                className="pipeline-energy-beam"
                d="M115 55 H295 M385 55 H565"
                stroke="url(#beamGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#e0b68a" />
                  <stop offset="100%" stopColor="#61dafb" />
                </linearGradient>
              </defs>

              {/* Node 1: Low-level CS */}
              <g transform="translate(20, 18)">
                <rect
                  width="95"
                  height="74"
                  rx="14"
                  fill="rgba(16, 30, 24, 0.95)"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                />
                <text x="47.5" y="32" textAnchor="middle" className="node-tag">
                  01 / CORE
                </text>
                <text x="47.5" y="54" textAnchor="middle" className="node-title">
                  C &amp; C++
                </text>
              </g>

              {/* Node 2: Full-Stack & 3D */}
              <g transform="translate(292, 18)">
                <rect
                  width="96"
                  height="74"
                  rx="14"
                  fill="rgba(16, 30, 24, 0.95)"
                  stroke="#e0b68a"
                  strokeWidth="1.5"
                />
                <text x="48" y="32" textAnchor="middle" className="node-tag">
                  02 / WEBGL
                </text>
                <text x="48" y="54" textAnchor="middle" className="node-title">
                  React · 3D
                </text>
              </g>

              {/* Node 3: AI Automation */}
              <g transform="translate(565, 18)">
                <rect
                  width="95"
                  height="74"
                  rx="14"
                  fill="rgba(16, 30, 24, 0.95)"
                  stroke="#61dafb"
                  strokeWidth="1.5"
                />
                <text x="47.5" y="32" textAnchor="middle" className="node-tag">
                  03 / AGENCY
                </text>
                <text x="47.5" y="54" textAnchor="middle" className="node-title">
                  AI &amp; RAG
                </text>
              </g>
            </svg>
          </div>

          {/* Animated Telemetry Metric Counters */}
          <div className="about-metrics-strip">
            <div className="metric-tile">
              <span className="metric-value">17+</span>
              <span className="metric-label">GitHub Repositories</span>
            </div>
            <div className="metric-tile">
              <span className="metric-value">Fillara AI</span>
              <span className="metric-label">AI Automation Agency</span>
            </div>
            <div className="metric-tile">
              <span className="metric-value">KUET ’25</span>
              <span className="metric-label">B.Sc. in CSE</span>
            </div>
            <div className="metric-tile">
              <span className="metric-value">24/7</span>
              <span className="metric-label">Autonomous RAG Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE VISUAL TECH ARSENAL WITH REAL ICONS & BARS */}
      <section className="visual-arsenal-section">
        <div className="visual-arsenal-top">
          <div>
            <span className="pillar-tag">INTERACTIVE COMMAND DECK</span>
            <h3>Engineering &amp; Automation Arsenal</h3>
          </div>

          {/* Filter Tabs */}
          <div className="arsenal-filter-pills" role="tablist">
            {DOMAIN_FILTERS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={[
                  "arsenal-filter-btn",
                  activeDomain === tab.id ? "arsenal-filter-btn--active" : "",
                ].join(" ")}
                onClick={() => setActiveDomain(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="visual-tech-grid">
          {filteredStack.map((tech, idx) => (
            <div
              className="visual-tech-card"
              key={tech.name}
              style={{
                "--tech-accent": tech.color,
                animationDelay: `${idx * 45}ms`,
              }}
            >
              <div className="visual-tech-card-top">
                <div className="visual-tech-icon-box">
                  <img src={tech.icon} alt={tech.name} loading="lazy" />
                </div>
                <span className="visual-tech-percent">{tech.level}</span>
              </div>

              <strong>{tech.name}</strong>

              <div className="visual-tech-meter">
                <div
                  className="visual-tech-meter-fill"
                  style={{ width: tech.level }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INFINITE KINETIC TICKER TAPE */}
      <div className="kinetic-marquee-Banner" aria-hidden="true">
        <div className="kinetic-marquee-track">
          <span>
            ⚡ FILLARA AI AUTOMATION · 🧠 RAG PIPELINES · 🕸️ N8N AGENTS · 🎮
            THREE.JS WEBGL · ⚛️ REACT &amp; NEXT.JS · ⚙️ C/C++ SYSTEMS · 🏛️ CSE
            @ KUET · 🐳 DOCKER &amp; SUPABASE ·{" "}
          </span>
          <span>
            ⚡ FILLARA AI AUTOMATION · 🧠 RAG PIPELINES · 🕸️ N8N AGENTS · 🎮
            THREE.JS WEBGL · ⚛️ REACT &amp; NEXT.JS · ⚙️ C/C++ SYSTEMS · 🏛️ CSE
            @ KUET · 🐳 DOCKER &amp; SUPABASE ·{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

const FEATURED_PROJECT = {
  id: "SYS_01 // FLAGSHIP DEPLOYMENT",
  title: "KUET Empty Room & Space Management",
  subtitle: "Real-Time Campus Classroom & Lab Availability Engine",
  description:
    "Built to eliminate classroom scheduling conflicts at Khulna University of Engineering & Technology. Tracks real-time room occupancy, routine slots, and empty lecture halls across campus departments with instant filtering.",
  live: "https://empty-room-iota.vercel.app/", // <-- PASTE YOUR LIVE URL HERE
  github: "https://github.com/NazmusSadat0/empty-room", // <-- PASTE YOUR REPO URL HERE
  metrics: [
    { label: "LATENCY", value: "< 80ms" },
    { label: "DATABASE", value: "Supabase RT" },
    { label: "STATUS", value: "Production" },
  ],
  stack: ["React", "Supabase", "JavaScript", "Tailwind / CSS3", "REST API"],
};

const LAB_PIPELINE = [
  {
    code: "BUILD_02 // LIVE PRODUCTION",
    title: "Nazmus's 3D Interactive Studio",
    category: "WebGL & Spatial UI",
    progress: 100,
    status: "LIVE ON NAZMUSSADAT.COM",
    desc: "Custom 3D isometric developer room built with React Three Fiber, ACES Filmic lighting, sonar HUD projections, and Google Apps Script serverless telemetry.",
    stack: ["Three.js", "React Three Fiber", "Vite", "Apps Script"],
    link: "https://github.com/NazmusSadat0/Projects/tree/master/nazmus-portfolio",
  },
  {
    code: "LAB_03 // SYSTEMS ARCHITECTURE",
    title: "Campus Lost & Found Intelligence",
    category: "Core C & Memory Systems",
    progress: 90,
    status: "CODEBASE COMPLETE",
    desc: "Modular C-based intelligence system utilizing dynamic memory allocation, custom file persistence (items.txt), and fast keyword matching for campus item recovery.",
    stack: ["C Language", "Dynamic Memory", "File I/O", "Modular CLI"],
    link: "https://github.com/NazmusSadat0/Campus-Lost-And-Found-Intelligence-System",
  },
  {
    code: "LAB_04 // IN STAGING",
    title: "Fillara AI — Autonomous RAG & CSE Portal",
    category: "AI Automation & Next.js",
    progress: 72,
    status: "IN ACTIVE DEVELOPMENT",
    desc: "Next-gen department notice & CT rescheduling portal paired with autonomous n8n + RAG workflows for instant student and client notifications.",
    stack: ["Next.js", "n8n Agents", "RAG Pipeline", "Supabase"],
    link: "",
  },
];

function ProjectsFullPage() {
  return (
    <div className="projects-command-layout">
      {/* 1. FLAGSHIP SPOTLIGHT CASE STUDY */}
      <article className="flagship-project-card">
        {/* Left: Project Breakdown & Actions */}
        <div className="flagship-content">
          <div className="flagship-top-badges">
            <span className="cyber-pill cyber-pill--gold">
              ★ FEATURED FLAGSHIP
            </span>
            <span className="cyber-pill cyber-pill--green">
              ● LIVE DEPLOYMENT
            </span>
          </div>

          <span className="flagship-code">{FEATURED_PROJECT.id}</span>
          <h2 className="flagship-title">{FEATURED_PROJECT.title}</h2>
          <p className="flagship-subtitle">{FEATURED_PROJECT.subtitle}</p>
          <p className="flagship-desc">{FEATURED_PROJECT.description}</p>

          {/* Key Telemetry Metrics */}
          <div className="flagship-metrics-row">
            {FEATURED_PROJECT.metrics.map((m) => (
              <div className="flagship-metric-box" key={m.label}>
                <span>{m.label}</span>
                <strong>{m.value}</strong>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="flagship-stack-row">
            {FEATURED_PROJECT.stack.map((tech) => (
              <span className="tech-badge" key={tech}>
                <span className="tech-badge-dot" />
                {tech}
              </span>
            ))}
          </div>

          {/* Direct Action Buttons */}
          <div className="flagship-actions">
            {FEATURED_PROJECT.live && (
              <a
                href={FEATURED_PROJECT.live}
                target="_blank"
                rel="noreferrer"
                className="spotlight-btn spotlight-btn--primary"
              >
                <span>Launch Live System ↗</span>
              </a>
            )}
            {FEATURED_PROJECT.github && (
              <a
                href={FEATURED_PROJECT.github}
                target="_blank"
                rel="noreferrer"
                className="spotlight-btn spotlight-btn--ghost"
              >
                <span>Inspect Source Code ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Right: Animated Interactive Spatial Blueprint Visualizer */}
        <div className="flagship-visualizer" aria-hidden="true">
          <div className="blueprint-window">
            <div className="blueprint-header">
              <div className="console-dots">
                <span />
                <span />
                <span />
              </div>
              <span>KUET_SPACE_RADAR // LIVE_MATRIX</span>
            </div>

            <div className="blueprint-grid-canvas">
              <svg viewBox="0 0 360 240" fill="none" className="blueprint-svg">
                {/* Architectural Grid Lines */}
                <path
                  d="M20 60 H340 M20 120 H340 M20 180 H340 M120 20 V220 M240 20 V220"
                  stroke="rgba(224, 182, 138, 0.14)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Room Slot 1: Available */}
                <g transform="translate(30, 30)">
                  <rect
                    width="80"
                    height="45"
                    rx="8"
                    fill="rgba(74, 222, 128, 0.12)"
                    stroke="#4ade80"
                    strokeWidth="1.5"
                  />
                  <circle cx="16" cy="16" r="4" fill="#4ade80" />
                  <text x="26" y="19" className="bp-room-code">
                    CSE-301
                  </text>
                  <text x="12" y="36" className="bp-room-status bp-free">
                    VACANT · NOW
                  </text>
                </g>

                {/* Room Slot 2: Occupied */}
                <g transform="translate(140, 30)">
                  <rect
                    width="80"
                    height="45"
                    rx="8"
                    fill="rgba(248, 113, 113, 0.08)"
                    stroke="rgba(248, 113, 113, 0.45)"
                    strokeWidth="1.2"
                  />
                  <circle cx="16" cy="16" r="4" fill="#f87171" />
                  <text x="26" y="19" className="bp-room-code">
                    CSE-302
                  </text>
                  <text x="12" y="36" className="bp-room-status bp-busy">
                    IN SESSION
                  </text>
                </g>

                {/* Room Slot 3: Available */}
                <g transform="translate(250, 30)">
                  <rect
                    width="80"
                    height="45"
                    rx="8"
                    fill="rgba(74, 222, 128, 0.12)"
                    stroke="#4ade80"
                    strokeWidth="1.5"
                  />
                  <circle cx="16" cy="16" r="4" fill="#4ade80" />
                  <text x="26" y="19" className="bp-room-code">
                    LAB-204
                  </text>
                  <text x="12" y="36" className="bp-room-status bp-free">
                    VACANT · NOW
                  </text>
                </g>

                {/* Central Animated Query Node */}
                <g transform="translate(95, 130)">
                  <rect
                    width="170"
                    height="64"
                    rx="12"
                    fill="rgba(14, 26, 20, 0.95)"
                    stroke="#e0b68a"
                    strokeWidth="1.6"
                  />
                  <text x="85" y="26" textAnchor="middle" className="bp-node-label">
                    SUPABASE REALTIME ENGINE
                  </text>
                  <text x="85" y="46" textAnchor="middle" className="bp-node-main">
                    2 Rooms Available ✓
                  </text>
                </g>

                {/* Animated Data Beams Connecting Rooms to Engine */}
                <path
                  className="pipeline-energy-beam"
                  d="M70 75 V162 H95 M290 75 V162 H265"
                  stroke="#4ade80"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="blueprint-footer">
              <span className="status-dot" />
              <span>QUERY_ENGINE: ONLINE · ZERO SCHEDULING CONFLICTS</span>
            </div>
          </div>
        </div>
      </article>

      {/* 2. ACTIVE ENGINEERING LAB & BUILD PIPELINE */}
      <section className="lab-pipeline-section">
        <div className="lab-pipeline-header">
          <div>
            <span className="pillar-tag">ENGINEERING LAB // R&amp;D QUEUE</span>
            <h3>Additional Builds &amp; Active Development</h3>
          </div>
          <span className="lab-pipeline-sub">
            Live Telemetry on Current &amp; Upcoming Systems
          </span>
        </div>

        <div className="lab-pipeline-grid">
          {LAB_PIPELINE.map((item) => (
            <article className="lab-build-card" key={item.title}>
              <div className="lab-build-top">
                <span className="lab-build-code">{item.code}</span>
                <span
                  className={[
                    "lab-status-pill",
                    item.progress === 100 ? "lab-status-pill--live" : "",
                  ].join(" ")}
                >
                  {item.status}
                </span>
              </div>

              <h4>{item.title}</h4>
              <p>{item.desc}</p>

              {/* Build Progress Meter */}
              <div className="lab-progress-block">
                <div className="lab-progress-labels">
                  <span>BUILD COMPLETION</span>
                  <strong>{item.progress}%</strong>
                </div>
                <div className="lab-progress-track">
                  <div
                    className="lab-progress-fill"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="lab-card-footer">
                <div className="lab-mini-tags">
                  {item.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="lab-repo-link"
                  >
                    Repo ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}