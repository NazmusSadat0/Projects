import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace } from "three";

import useReducedMotion from "../hooks/useReducedMotion";

const lines = [
  "const portfolio = {",
  '  name: "Nazmus",',
  '  stack: ["React", "Three.js"],',
  "  projects: [",
  '    "KUET Empty Room",',
  '    "Farm Management",',
  "  ],",
  "};",
  "",
  "export default portfolio;",
];

export default function AnimatedMonitor() {
  const material = useRef();
  const display = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 1024;
    canvas.height = 576;

    const ctx = canvas.getContext("2d");
    const texture = new CanvasTexture(canvas);

    texture.colorSpace = SRGBColorSpace;

    function draw(time, still) {
      // Editor background.
      ctx.fillStyle = "#17242b";
      ctx.fillRect(0, 0, 1024, 576);

      // Tab bar.
      ctx.fillStyle = "#223239";
      ctx.fillRect(0, 0, 1024, 54);

      ctx.fillStyle = "#a8b9b4";
      ctx.font = "20px monospace";
      ctx.fillText("portfolio.js", 34, 35);

      ctx.fillStyle = "#b87951";
      ctx.fillRect(22, 51, 174, 3);

      // Reveal the code progressively, then hold before repeating.
      const all = lines.join("\n");

      const count = still
        ? all.length
        : Math.min(
            all.length,
            Math.floor((time % 24) * 22)
          );

      const visible = all.slice(0, count).split("\n");

      ctx.font = "23px monospace";

      lines.forEach((_, index) => {
        ctx.fillStyle = "#536a72";

        ctx.fillText(
          String(index + 1),
          30,
          104 + index * 36
        );
      });

      visible.forEach((line, index) => {
        ctx.fillStyle = [
          "#94c4bd",
          "#dec199",
          "#b4c4cc",
        ][index % 3];

        ctx.fillText(line, 88, 104 + index * 36);
      });

      // Blinking cursor.
      if (!still && Math.floor(time * 2) % 2 === 0) {
        const last = visible[visible.length - 1];

        ctx.fillStyle = "#d3b182";

        ctx.fillRect(
          88 + ctx.measureText(last).width,
          84 + (visible.length - 1) * 36,
          2,
          25
        );
      }

      // Status bar.
      ctx.fillStyle = "#253b40";
      ctx.fillRect(0, 531, 1024, 45);

      ctx.fillStyle = "#a7bdb4";
      ctx.font = "17px monospace";

      ctx.fillText(
        "main                        JavaScript                 UTF-8",
        25,
        560
      );

      texture.needsUpdate = true;
    }

    draw(0, true);

    material.current.map = texture;
    material.current.needsUpdate = true;

    display.current = {
      draw,
      elapsed: 0,
      next: 0,
    };

    return () => {
      display.current = null;
      texture.dispose();
    };
  }, []);

  useFrame((_, delta) => {
    const state = display.current;
    if (!state) return;

    state.elapsed += Math.min(delta, 0.05);

    // Update the texture at eight frames per second.
    if (state.elapsed < state.next) return;

    state.next = state.elapsed + 0.125;
    state.draw(state.elapsed, reduced);
  });

  return (
    <mesh position={[-0.25, 2.24, -2.16]}>
      <planeGeometry args={[1.76, 0.94]} />

      <meshBasicMaterial
        ref={material}
        toneMapped={false}
      />
    </mesh>
  );
}