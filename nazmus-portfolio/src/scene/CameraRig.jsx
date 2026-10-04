import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

// Fixed position near the entrance, inside the room.
export const EYE_POSITION = [0, 2.15, 2.55];

// Slight downward gaze so the desk surface remains visible.
const HEAD_PITCH = -0.12;

// Turn approximately 89 degrees in either direction.
const MAX_HEAD_TURN = MathUtils.degToRad(89);

function clampYaw(value) {
  return MathUtils.clamp(
    value,
    -MAX_HEAD_TURN,
    MAX_HEAD_TURN
  );
}

export default function CameraRig() {
  const { camera, gl, size } = useThree();

  const targetYaw = useRef(0);
  const currentYaw = useRef(0);
  const reducedMotion = useRef(false);

  // Set the initial interior viewpoint before rendering.
  useLayoutEffect(() => {
    camera.position.set(...EYE_POSITION);
    camera.rotation.set(HEAD_PITCH, 0, 0, "YXZ");
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Adjust the lens for the screen shape, without fitting
  // the entire room into the viewport.
  useLayoutEffect(() => {
    if (!camera.isPerspectiveCamera) return;

    const aspect = size.width / Math.max(size.height, 1);
    const portrait = aspect < 1;

    const preferredVerticalFov = portrait ? 62 : 50;

    // Prevent ultrawide screens from showing an excessively
    // wide, distorted view of the room.
    const maximumHorizontalFov = MathUtils.degToRad(80);

    const verticalFovForHorizontalLimit =
      MathUtils.radToDeg(
        2 *
          Math.atan(
            Math.tan(maximumHorizontalFov / 2) / aspect
          )
      );

    camera.fov = Math.min(
      preferredVerticalFov,
      verticalFovForHorizontalLimit
    );

    camera.aspect = aspect;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function updatePreference() {
      reducedMotion.current = preference.matches;
    }

    updatePreference();

    preference.addEventListener(
      "change",
      updatePreference
    );

    return () => {
      preference.removeEventListener(
        "change",
        updatePreference
      );
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    let drag = null;

    function pointerDown(event) {
      if (!event.isPrimary || event.button !== 0) return;

      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startYaw: targetYaw.current,
      };

      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
    }

    function pointerMove(event) {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      const horizontalDistance =
        event.clientX - drag.startX;

      // Dragging across most of the screen turns the head
      // roughly 100 degrees. Repeat swipes can reach the limit.
      const radiansPerPixel =
        MathUtils.degToRad(100) /
        Math.max(canvas.clientWidth, 320);

      // Grab-style movement: drag the scene to the right
      // to reveal what is on your left.
      targetYaw.current = clampYaw(
        drag.startYaw +
          horizontalDistance * radiansPerPixel
      );
    }

    function endDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      const pointerId = drag.pointerId;

      drag = null;
      canvas.classList.remove("is-dragging");

      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    }

    function cancelDrag() {
      if (!drag) return;

      const pointerId = drag.pointerId;

      drag = null;
      canvas.classList.remove("is-dragging");

      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    }

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("lostpointercapture", endDrag);

    window.addEventListener("blur", cancelDrag);

    return () => {
      canvas.removeEventListener(
        "pointerdown",
        pointerDown
      );

      canvas.removeEventListener(
        "pointermove",
        pointerMove
      );

      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener(
        "pointercancel",
        endDrag
      );

      canvas.removeEventListener(
        "lostpointercapture",
        endDrag
      );

      window.removeEventListener("blur", cancelDrag);

      cancelDrag();
    };
  }, [gl]);

  useFrame((_, delta) => {
    currentYaw.current = reducedMotion.current
      ? targetYaw.current
      : MathUtils.damp(
          currentYaw.current,
          targetYaw.current,
          12,
          Math.min(delta, 0.05)
        );

    // Position never circles around the room.
    camera.position.set(...EYE_POSITION);

    // Only the direction changes.
    // Pitch is fixed; roll remains zero.
    camera.rotation.set(
      HEAD_PITCH,
      currentYaw.current,
      0,
      "YXZ"
    );
  });

  return null;
}