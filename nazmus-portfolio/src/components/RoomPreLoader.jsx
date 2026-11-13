import { useEffect, useState } from "react";
import "../styles/RoomPreLoader.css";

const LOADING_STAGES = [
  { threshold: 0, text: "Initializing 3D environment..." },
  { threshold: 25, text: "Building studio architecture & walls..." },
  { threshold: 55, text: "Calibrating warm lighting & shadows..." },
  { threshold: 80, text: "Booting interactive terminal & guestbook..." },
  { threshold: 100, text: "Welcome to Nazmus's Room." },
];

export default function RoomPreloader({ ready }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let rafId;
    let current = 0;

    const tick = () => {
      // Cap at 92% until the 3D model actually finishes loading
      const target = ready ? 100 : 92;
      const speed = ready ? 1.6 : 0.45;

      if (current < target) {
        current = Math.min(target, current + speed);
        setProgress(Math.floor(current));
        rafId = requestAnimationFrame(tick);
      } else if (current >= 100) {
        setProgress(100);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ready]);

  useEffect(() => {
    if (progress < 100) return;

    // Hold at 100% briefly, then trigger curtain exit
    const leaveTimer = setTimeout(() => setLeaving(true), 380);
    const hideTimer = setTimeout(() => setVisible(false), 1050);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [progress]);

  if (!visible) return null;

  const currentStage =
    [...LOADING_STAGES].reverse().find((s) => progress >= s.threshold)?.text ||
    LOADING_STAGES[0].text;

  return (
    <div
      className={[
        "room-preloader",
        leaving ? "room-preloader--leaving" : "",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      <div className="preloader-ambient-glow" aria-hidden="true" />

      {/* Top Brand Header */}
      <header className="preloader-top-bar">
        <span className="preloader-brand">
          NAZMUS <span>//</span> 3D STUDIO
        </span>
        <span className="preloader-coords">22.8456° N, 89.5403° E</span>
      </header>

      {/* Center Interactive Progress Showcase */}
      <div className="preloader-center">
        {/* Animated Isometric Wireframe Cube + Counter */}
        <div className="preloader-hero-row">
          <div className="preloader-wireframe" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none">
              <polygon
                points="60,12 104,36 104,84 60,108 16,84 16,36"
                stroke="rgba(224, 182, 138, 0.25)"
                strokeWidth="1.5"
              />
              <polygon
                points="60,12 104,36 60,60 16,36"
                stroke="#e0b68a"
                strokeWidth="1.8"
                strokeDasharray="200"
                strokeDashoffset={200 - progress * 2}
              />
              <polyline
                points="16,36 60,60 60,108"
                stroke="#e0b68a"
                strokeWidth="1.8"
              />
              <polyline
                points="104,36 60,60"
                stroke="rgba(224, 182, 138, 0.5)"
                strokeWidth="1.5"
              />
              <circle cx="60" cy="60" r="4" fill="#4ade80" />
            </svg>
          </div>

          <div className="preloader-percentage-wrap">
            <span className="preloader-number">
              {String(progress).padStart(2, "0")}
            </span>
            <span className="preloader-percent-sign">%</span>
          </div>
        </div>

        {/* High-Impact Visual Progress Bar */}
        <div className="preloader-bar-container">
          <div className="preloader-bar-header">
            <span className="preloader-stage-text">{currentStage}</span>
            <span className="preloader-fraction">{progress} / 100</span>
          </div>

          <div className="preloader-bar-track">
            <div
              className="preloader-bar-fill"
              style={{ width: `${progress}%` }}
            >
              <span className="preloader-bar-spark" />
            </div>
          </div>

          {/* 20-Segment Technical Tick Marks */}
          <div className="preloader-segments" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className={
                  progress >= (i + 1) * 5 ? "segment-tick--active" : ""
                }
              />
            ))}
          </div>
        </div>

        {/* Built-In Controls Tip (So visitors read it while loading) */}
        <div className="preloader-controls-card">
          <div className="controls-drag-anim" aria-hidden="true">
            <span>‹</span>
            <span className="controls-dot" />
            <span>›</span>
          </div>
          <p>
            <strong>How to navigate:</strong> Drag the screen or press{" "}
            <kbd>←</kbd> <kbd>→</kbd> arrow keys to rotate the room. Click any
            glowing marker to open sections.
          </p>
        </div>
      </div>
    </div>
  );
}