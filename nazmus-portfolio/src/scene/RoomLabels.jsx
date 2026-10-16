import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const labels = [
  {
    id: "projects",
    text: "Projects",
    number: "01",
    position: [-0.25, 2.95, -2.15],
  },
  {
    id: "about",
    text: "About Me",
    number: "02",
    position: [-3.25, 2.35, -0.5],
  },
  {
    id: "contact",
    text: "Contact",
    number: "03",
    position: [2, 2.25, -1.95],
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

      const padX = 48;
      const padY = 48;

      const visible =
        cameraSpace.current.z < 0 &&
        point.z >= -1 &&
        point.z <= 1 &&
        x > padX &&
        x < size.width - padX &&
        y > padY &&
        y < size.height - 20;

      element.style.visibility = visible
        ? "visible"
        : "hidden";

      if (visible) {
        element.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
          "translate(-50%, -100%)";
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
      {labels.map((label, index) => (
        <div
          key={label.id}
          className={[
            "room-label-anchor",
            hovered === label.id ? "marker-active" : "",
          ].join(" ")}
          ref={(element) => {
            elements.current[index] = element;
          }}
        >
          <button
            type="button"
            className="object-marker-title"
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
            <span className="object-marker-number">
              {label.number}
            </span>

            <span>{label.text}</span>
            <span
              className="object-marker-arrow"
              aria-hidden="true"
            >
              ↗
            </span>
          </button>

          <span className="object-marker-line" />
          <span className="object-marker-point" />
        </div>
      ))}
    </div>
  );
}