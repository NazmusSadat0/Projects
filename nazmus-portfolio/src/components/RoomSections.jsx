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
  email: "",
  github: "",
  linkedin: "",
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

          {section === "contact" && (
            <div className="portfolio-contact-view">
              <p className="portfolio-lead">
                Have a project in mind or want to collaborate? Let’s connect.
              </p>

              <div className="portfolio-contact-grid">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="contact-tile">
                    <span className="contact-tile-label">Email</span>
                    <strong>{contact.email}</strong>
                  </a>
                )}
                {contact.github && (
                  <a href={contact.github} target="_blank" rel="noreferrer" className="contact-tile">
                    <span className="contact-tile-label">GitHub</span>
                    <strong>View Profile ↗</strong>
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-tile">
                    <span className="contact-tile-label">LinkedIn</span>
                    <strong>Connect ↗</strong>
                  </a>
                )}
              </div>
            </div>
          )}

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