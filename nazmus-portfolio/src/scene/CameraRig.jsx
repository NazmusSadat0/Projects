import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

import useReducedMotion from "../hooks/useReducedMotion";

export const EYE_POSITION = [0, 2.15, 2.55];

const LIMIT = MathUtils.degToRad(89);

const clamp = (value) =>
  MathUtils.clamp(value, -LIMIT, LIMIT);

export default function CameraRig({ ready = true }) {
  const { camera, gl, size } = useThree();

  const target = useRef(0);
  const yaw = useRef(0);
  const intro = useRef(0);

  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const aspect =
      size.width / Math.max(size.height, 1);

    const horizontalLimit =
      2 *
      Math.atan(
        Math.tan(MathUtils.degToRad(40)) / aspect
      );

    camera.fov = Math.min(
      aspect < 1 ? 62 : 50,
      MathUtils.radToDeg(horizontalLimit)
    );

    camera.aspect = aspect;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useEffect(() => {
    const canvas = gl.domElement;

    let drag = null;

    function down(event) {
      if (!event.isPrimary || event.button !== 0) {
        return;
      }

      drag = {
        id: event.pointerId,
        x: event.clientX,
        yaw: target.current,
      };

      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
    }

    function move(event) {
      if (!drag || event.pointerId !== drag.id) {
        return;
      }

      const sensitivity =
        MathUtils.degToRad(100) /
        Math.max(canvas.clientWidth, 320);

      target.current = clamp(
        drag.yaw +
          (event.clientX - drag.x) * sensitivity
      );
    }

    function end(event) {
      if (
        !drag ||
        (event?.pointerId !== undefined &&
          event.pointerId !== drag.id)
      ) {
        return;
      }

      const id = drag.id;
      drag = null;

      canvas.classList.remove("is-dragging");

      if (canvas.hasPointerCapture(id)) {
        canvas.releasePointerCapture(id);
      }
    }

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("lostpointercapture", end);

    window.addEventListener("blur", end);

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);

      canvas.removeEventListener(
        "lostpointercapture",
        end
      );

      window.removeEventListener("blur", end);

      end();
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (ready) {
      intro.current = reduced
        ? 1
        : Math.min(1, intro.current + dt / 1.8);
    }

    const remaining = reduced
      ? 0
      : Math.pow(1 - intro.current, 3);

    yaw.current = reduced
      ? target.current
      : MathUtils.damp(
          yaw.current,
          target.current,
          12,
          dt
        );

    camera.position.set(
      EYE_POSITION[0],
      EYE_POSITION[1],
      EYE_POSITION[2] + 0.24 * remaining
    );

    camera.rotation.set(
      -0.12,
      yaw.current,
      0,
      "YXZ"
    );
  });

  return null;
}