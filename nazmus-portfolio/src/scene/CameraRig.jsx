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
const KEY_SPEED = MathUtils.degToRad(58);

const clamp = (value) =>
  MathUtils.clamp(value, -LIMIT, LIMIT);

export default function CameraRig({
  ready = true,
  section = null,
  onInteract,
}) {
  const { camera, gl, size } = useThree();

  const target = useRef(0);
  const yaw = useRef(0);
  const intro = useRef(0);
  const teaserProgress = useRef(0);
  const hasInteracted = useRef(false);
  const keys = useRef({ left: false, right: false });

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

  // Pointer drag rotation
  useEffect(() => {
    const canvas = gl.domElement;
    let drag = null;

    function down(event) {
      if (!event.isPrimary || event.button !== 0) return;

      drag = {
        id: event.pointerId,
        x: event.clientX,
        yaw: target.current,
      };

      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
    }

    function move(event) {
      if (!drag || event.pointerId !== drag.id) return;

      if (Math.abs(event.clientX - drag.x) > 6) {
        hasInteracted.current = true;
        onInteract?.();
      }

      const sensitivity =
        MathUtils.degToRad(100) /
        Math.max(canvas.clientWidth, 320);

      target.current = clamp(
        drag.yaw + (event.clientX - drag.x) * sensitivity
      );
    }

    function end(event) {
      if (!drag || (event?.pointerId !== undefined && event.pointerId !== drag.id)) {
        return;
      }
      const id = drag.id;
      drag = null;
      canvas.classList.remove("is-dragging");
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
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
      canvas.removeEventListener("lostpointercapture", end);
      window.removeEventListener("blur", end);
      end();
    };
  }, [gl, onInteract]);

  // Keyboard rotation (Arrow keys and A / D)
  useEffect(() => {
    function handleKeyDown(event) {
      if (section) return;
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        keys.current.left = true;
        hasInteracted.current = true;
        onInteract?.();
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        keys.current.right = true;
        hasInteracted.current = true;
        onInteract?.();
      }
    }

    function handleKeyUp(event) {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        keys.current.left = false;
      } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        keys.current.right = false;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [section, onInteract]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (ready) {
      intro.current = reduced
        ? 1
        : Math.min(1, intro.current + dt / 1.5);
    }

    // Teaser pan: gently nudges the room left and back once on entry
    let teaserOffset = 0;
    if (ready && !hasInteracted.current && !reduced) {
      teaserProgress.current = Math.min(
        1,
        teaserProgress.current + dt / 1.4
      );
      teaserOffset =
        Math.sin(teaserProgress.current * Math.PI) * 0.12;
    }

    const keyDirection =
      (keys.current.left ? 1 : 0) - (keys.current.right ? 1 : 0);

    if (keyDirection !== 0) {
      target.current = clamp(
        target.current + keyDirection * KEY_SPEED * dt
      );
    }

    const remaining = reduced ? 0 : Math.pow(1 - intro.current, 3);

    yaw.current = reduced
      ? target.current
      : MathUtils.damp(yaw.current, target.current + teaserOffset, 10, dt);

    camera.position.set(
      EYE_POSITION[0],
      EYE_POSITION[1],
      EYE_POSITION[2] + 0.24 * remaining
    );

    camera.rotation.set(-0.12, yaw.current, 0, "YXZ");
  });

  return null;
}