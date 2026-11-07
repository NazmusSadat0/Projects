import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";

import useReducedMotion from "../hooks/useReducedMotion";

function sectionFor(object) {
  while (object) {
    const name = object.name || "";
    const lower = name.toLowerCase();

    // Skip generic architecture and windows
    if (
      name.startsWith("Architecture_") ||
      lower.includes("floor") ||
      lower.includes("ceiling") ||
      lower.includes("window")
    ) {
      object = object.parent;
      continue;
    }

    if (
      ["Projects", "ProjectsScreen"].includes(name) ||
      lower.includes("project") ||
      lower.includes("monitor")
    ) {
      return "projects";
    }

    // Matches the wall portrait, picture frame, artwork, and bookshelf
    if (
      [
        "AboutMe",
        "About",
        "Picture",
        "Portrait",
        "Frame",
        "Artwork",
        "Painting",
        "Photo",
        "WallArt",
      ].includes(name) ||
      lower.includes("about") ||
      lower.includes("picture") ||
      lower.includes("portrait") ||
      lower.includes("artwork") ||
      lower.includes("painting") ||
      lower.includes("photo") ||
      lower.includes("frame") ||
      lower.includes("bookshelf")
    ) {
      return "about";
    }

    if (
      ["Contact", "ContactScreen"].includes(name) ||
      lower.includes("contact") ||
      lower.includes("phone")
    ) {
      return "contact";
    }

    object = object.parent;
  }

  return null;
}

function isScreenMesh(object) {
  let current = object;
  while (current) {
    if (
      ["ProjectsScreen", "ContactScreen"].includes(
        current.name
      )
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export default function RoomInteractions({
  children,
  ready,
  hovered,
  onHover,
  onOpen,
}) {
  const group = useRef();
  const surfaces = useRef([]);
  const down = useRef(null);

  const { gl } = useThree();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ready || !group.current) return;

    const items = [];

    group.current.traverse((object) => {
      if (!object.isMesh || isScreenMesh(object)) return;

      const section = sectionFor(object);
      if (!section) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (!material.color) return;

        items.push({
          section,
          material,
          base: material.color.clone(),
          shade: 1,
        });
      });
    });

    surfaces.current = items;

    return () => {
      items.forEach((item) => {
        item.material.color.copy(item.base);
      });

      surfaces.current = [];
    };
  }, [ready]);

  useEffect(() => {
    const canvas = gl.domElement;

    function start(event) {
      if (!event.isPrimary) return;

      down.current = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
      };
    }

    function move(event) {
      const pointer = down.current;
      if (!pointer) return;

      const distance = Math.hypot(
        event.clientX - pointer.x,
        event.clientY - pointer.y
      );

      if (distance > 7) {
        pointer.moved = true;
      }
    }

    function cancel() {
      down.current = null;
      onHover(null);
    }

    canvas.addEventListener("pointerdown", start, true);
    canvas.addEventListener("pointermove", move, true);
    canvas.addEventListener("pointerleave", cancel);
    canvas.addEventListener("pointercancel", cancel);

    return () => {
      canvas.removeEventListener("pointerdown", start, true);
      canvas.removeEventListener("pointermove", move, true);
      canvas.removeEventListener("pointerleave", cancel);
      canvas.removeEventListener("pointercancel", cancel);
    };
  }, [gl, onHover]);

  useFrame((_, delta) => {
    surfaces.current.forEach((item) => {
      // Clear 28% luminance boost on hover
      const target =
        hovered === item.section ? 1.28 : 1;

      item.shade = reduced
        ? target
        : MathUtils.damp(
            item.shade,
            target,
            12,
            Math.min(delta, 0.05)
          );

      item.material.color
        .copy(item.base)
        .multiplyScalar(item.shade);
    });
  });

  return (
    <group
      ref={group}
      onPointerMove={(event) => {
        event.stopPropagation();
        onHover(
          event.buttons ? null : sectionFor(event.object)
        );
      }}
      onPointerLeave={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation();

        const section = sectionFor(event.object);

        if (
          section &&
          down.current &&
          !down.current.moved &&
          event.delta <= 7
        ) {
          onHover(null);
          onOpen(section);
        }

        down.current = null;
      }}
    >
      {children}
    </group>
  );
}