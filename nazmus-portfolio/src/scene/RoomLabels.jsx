import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const labels = [
  {
    id: "projects",
    text: "Projects",
    position: [-0.25, 2.95, -2.15],
  },
  {
    id: "about",
    text: "About Me",
    position: [-3.25, 2.35, -0.5],
  },
  {
    id: "contact",
    text: "Contact",
    position: [2, 2.25, -1.95],
  },
];

export default function RoomLabels({ elements }) {
  const projected = useRef(new Vector3());
  const cameraSpace = useRef(new Vector3());

  const { camera, size } = useThree();

  useFrame(() => {
    // CameraRig updates the camera before this callback.
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

      const halfWidth = element.offsetWidth / 2;
      const labelHeight = element.offsetHeight;

      const visible =
        cameraSpace.current.z < 0 &&
        point.z >= -1 &&
        point.z <= 1 &&
        x > halfWidth + 12 &&
        x < size.width - halfWidth - 12 &&
        y > labelHeight + 12 &&
        y < size.height - 24;

      element.style.visibility = visible ? "visible" : "hidden";

      element.style.transform =
        `translate3d(${x}px, ${y}px, 0) ` +
        "translate(-50%, -100%)";
    });
  }, 0.5);

  return null;
}

// HTML must be rendered by React DOM, outside the Three Fiber canvas.
export function RoomLabelOverlay({ elements }) {
  return (
    <div className="room-label-layer" aria-hidden="true">
      {labels.map((label, index) => (
        <div
          key={label.id}
          className="room-label-anchor"
          ref={(element) => {
            elements.current[index] = element;
          }}
        >
          <span className="room-label">
            <span className="room-label-dot" />
            {label.text}
          </span>

          <span className="room-label-stem" />
        </div>
      ))}
    </div>
  );
}
