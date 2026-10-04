import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";

export const INITIAL_ANGLE = 0.52;
export const MIN_ANGLE = 0.12;
export const MAX_ANGLE = 0.91;

export function clampAngle(angle) {
  return MathUtils.clamp(angle, MIN_ANGLE, MAX_ANGLE);
}

export default function CameraRig({ angle }) {
  const { camera, size, gl } = useThree();

  const current = useRef(INITIAL_ANGLE);
  const reducedMotion = useRef(false);

  // Respect the visitor's reduced-motion preference.
  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      reducedMotion.current = query.matches;
    };

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  // Calculate a fixed framing that fits the room throughout
  // its permitted rotation range.
  useEffect(() => {
    const previousPosition = camera.position.clone();
    const previousQuaternion = camera.quaternion.clone();

    let maxX = 0;
    let maxY = 0;

    const corner = new Vector3();

    for (let step = 0; step <= 20; step++) {
      const angleToCheck =
        MIN_ANGLE + ((MAX_ANGLE - MIN_ANGLE) * step) / 20;

      camera.position.set(
        Math.sin(angleToCheck) * 14,
        10,
        Math.cos(angleToCheck) * 14
      );

      camera.lookAt(0, 1.35, 0);
      camera.updateMatrixWorld();

      // Bounding corners around the entire room.
      for (const x of [-4.15, 4.15]) {
        for (const y of [-0.32, 3.42]) {
          for (const z of [-3.15, 3.15]) {
            corner
              .set(x, y, z)
              .applyMatrix4(camera.matrixWorldInverse);

            maxX = Math.max(maxX, Math.abs(corner.x));
            maxY = Math.max(maxY, Math.abs(corner.y));
          }
        }
      }
    }

    const widthZoom = (size.width * 0.94) / (maxX * 2);
    const heightZoom =
      ((size.height - 110) * 0.96) / (maxY * 2);

    camera.zoom = Math.max(
      Math.min(widthZoom, heightZoom),
      1
    );

    camera.position.copy(previousPosition);
    camera.quaternion.copy(previousQuaternion);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  // Mouse and touch dragging.
  useEffect(() => {
    const canvas = gl.domElement;
    let drag = null;

    const down = (event) => {
      if (!event.isPrimary || event.button !== 0) return;

      drag = {
        id: event.pointerId,
        x: event.clientX,
        start: angle.current,
      };

      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
    };

    const move = (event) => {
      if (!drag || drag.id !== event.pointerId) return;

      const horizontalDistance = event.clientX - drag.x;

      angle.current = clampAngle(
        drag.start - horizontalDistance * 0.003
      );
    };

    const up = (event) => {
      if (!drag || drag.id !== event.pointerId) return;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      drag = null;
      canvas.classList.remove("is-dragging");
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("lostpointercapture", up);

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);

      canvas.classList.remove("is-dragging");
    };
  }, [angle, gl]);

  // Smooth rotation, without changing camera height or distance.
  useFrame((_, delta) => {
    current.current = reducedMotion.current
      ? angle.current
      : MathUtils.damp(
          current.current,
          angle.current,
          9,
          delta
        );

    camera.position.set(
      Math.sin(current.current) * 14,
      10,
      Math.cos(current.current) * 14
    );

    camera.lookAt(0, 1.35, 0);
  });

  return null;
}