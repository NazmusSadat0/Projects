import { useEffect, useState } from "react";
import "../styles/RoomPreLoader.css";

export default function RoomPreloader({ ready }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!ready) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timeout = window.setTimeout(
      () => setVisible(false),
      reduced ? 120 : 650
    );

    return () => window.clearTimeout(timeout);
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      className={[
        "room-preloader",
        ready ? "room-preloader--leaving" : "",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy={!ready}
    >
      <span className="preloader-brand">
        NAZMUS <span>/</span> PORTFOLIO
      </span>

      <div className="preloader-content">
        <div
          className="preloader-illustration"
          aria-hidden="true"
        >
          <div className="preloader-halo" />

          <svg
            viewBox="0 0 360 250"
            fill="none"
            className="preloader-room"
          >
            {/* Room outline */}
            <g className="preloader-trace preloader-trace--shell">
              <path
                pathLength="1"
                d="M48 180 174 239 314 170 187 113Z"
              />

              <path
                pathLength="1"
                d="M48 180V63L187 13V113M187 13 314 65V170"
              />

              <path
                pathLength="1"
                d="M48 190 174 249 314 180"
              />
            </g>

            {/* Window and wall art */}
            <g className="preloader-trace preloader-trace--window">
              <path
                pathLength="1"
                d="M208 43 287 75V116L208 84ZM247 59V100"
              />

              <path
                pathLength="1"
                d="M70 70 110 56V99L70 114Z"
              />
            </g>

            {/* Desk, computer and keyboard */}
            <g className="preloader-trace preloader-trace--desk">
              <path
                pathLength="1"
                d="M119 142 204 103 288 140 207 180ZM126 146V183M278 146V184M211 180V216"
              />

              <path
                pathLength="1"
                d="M181 108V76L228 96V129ZM201 119V133L192 137 211 145 221 140"
              />

              <path
                pathLength="1"
                d="M170 145 184 138 212 151 197 158Z"
              />
            </g>

            {/* Chair and plant */}
            <g className="preloader-trace preloader-trace--details">
              <path
                pathLength="1"
                d="M82 159V137L109 149V173ZM83 162 73 170 100 184 111 176M79 174V190M104 181V203"
              />

              <path
                pathLength="1"
                d="M257 149 262 155 271 151 274 138 256 132ZM265 136V108M265 124Q245 119 249 106Q264 109 265 124ZM266 117Q278 102 285 112Q280 121 266 117Z"
              />
            </g>

            {/* Warm desk lamp */}
            <g className="preloader-lamp">
              <path d="M151 135 158 131 166 135 159 139ZM159 131V113L145 102 153 87" />

              <path
                d="M149 87Q158 82 166 92L149 98Z"
                fill="currentColor"
              />

              <path
                className="preloader-light"
                d="M149 98 137 126 183 139 166 92Z"
                fill="currentColor"
                stroke="none"
              />
            </g>

            <circle
              className="preloader-spark"
              cx="291"
              cy="39"
              r="2"
              fill="currentColor"
            />

            <circle
              className="preloader-spark preloader-spark--second"
              cx="40"
              cy="126"
              r="1.5"
              fill="currentColor"
            />
          </svg>
        </div>

        <p className="preloader-eyebrow">
          A PERSONAL SPACE
        </p>

        <h1 className="preloader-title">
          Step inside<span>.</span>
        </h1>

        <div className="preloader-status">
          <span
            className="preloader-status-dot"
            aria-hidden="true"
          />

          <span>
            {ready
              ? "Your room is ready"
              : "Loading your room"}
          </span>
        </div>

        <div
          className="preloader-track"
          aria-hidden="true"
        >
          <span />
        </div>
      </div>

      <p className="preloader-hint">
        Drag to look around
        <span>·</span>
        Tap objects to explore
      </p>
    </div>
  );
}