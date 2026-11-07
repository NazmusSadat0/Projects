import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const labels = [
  {
    id: "projects",
    text: "Projects",
    badge: "Terminal",
    position: [-0.25, 2.95, -2.15],
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="marker-icon-svg">
        <path
          d="M3 5L6.5 8L3 11M8 11H13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "about",
    text: "About Me",
    badge: "Story",
    position: [-3.25, 2.35, -0.5],
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="marker-icon-svg">
        <path
          d="M8 2.5C5.5 2.5 3.5 4.5 3.5 7C3.5 10 8 13.5 8 13.5C8 13.5 12.5 10 12.5 7C12.5 4.5 10.5 2.5 8 2.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="7" r="1.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "contact",
    text: "Contact",
    badge: "Connect",
    position: [2, 2.25, -1.95],
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="marker-icon-svg">
        <path
          d="M2.5 4.5H13.5V11.5H2.5V4.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 5L8 9L13.5 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function RoomLabels({ elements }) {
  const projected = useRef(new Vector3());
  const cameraSpace = useRef(new Vector3());
  const { camera, size } = useThree();

  useFrame(() => {
    camera.updateMatrixWorld();

    labels.forEach((label, index) => {
      const element = elements.current[index];
      if (!element) return;

      cameraSpace.current
        .set(...label.position)
        .applyMatrix4(camera.matrixWorldInverse);

      projected.current
        .set(...label.position)
        .project(camera);

      const point = projected.current;
      const x = (point.x * 0.5 + 0.5) * size.width;
      const y = (-point.y * 0.5 + 0.5) * size.height;

      const padX = 40;
      const padY = 40;

      const visible =
        cameraSpace.current.z < 0 &&
        point.z >= -1 &&
        point.z <= 1 &&
        x > padX &&
        x < size.width - padX &&
        y > padY &&
        y < size.height - 20;

      element.style.visibility = visible ? "visible" : "hidden";

      if (visible) {
        element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    });
  });

  return null;
}

export function RoomLabelOverlay({
  elements,
  hovered,
  hidden = false,
  onOpen,
  onHover,
}) {
  return (
    <div
      className={[
        "room-label-layer",
        "object-markers",
        hidden ? "markers-hidden" : "",
      ].join(" ")}
      aria-label="Explore the room"
      inert={hidden ? true : undefined}
    >
      {labels.map((label, index) => {
        const isActive = hovered === label.id;

        return (
          <div
            key={label.id}
            className={[
              "room-label-anchor",
              isActive ? "marker-active" : "",
            ].join(" ")}
            ref={(element) => {
              elements.current[index] = element;
            }}
          >
            <button
              type="button"
              className="unique-marker-card"
              onClick={() => {
                onHover(null);
                onOpen(label.id);
              }}
              onPointerEnter={() => onHover(label.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(label.id)}
              onBlur={() => onHover(null)}
              aria-label={`Open ${label.text}`}
            >
              <div className="marker-icon-box">{label.icon}</div>

              <div className="marker-text-group">
                <span className="marker-title">{label.text}</span>
                <span className="marker-badge">{label.badge}</span>
              </div>

              <div className="marker-arrow-chip">
                <span>Explore</span>
                <span className="marker-arrow" aria-hidden="true">→</span>
              </div>
            </button>

            {/* Futuristic sonar tether & ripple anchor */}
            <div className="sonar-tether">
              <span className="sonar-stem" />
              <div className="sonar-target">
                <span className="sonar-ripple ripple-1" />
                <span className="sonar-ripple ripple-2" />
                <span className="sonar-core" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}