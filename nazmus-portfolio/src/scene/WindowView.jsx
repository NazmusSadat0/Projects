import { useEffect, useRef } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

export default function WindowView() {
  const material = useRef();

  useEffect(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 2048;
    canvas.height = 720;

    const ctx = canvas.getContext("2d");

    const sky = ctx.createLinearGradient(0, 0, 0, 720);

    sky.addColorStop(0, "#96becd");
    sky.addColorStop(0.7, "#e7e6d6");
    sky.addColorStop(1, "#d3d9bb");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 2048, 720);

    ctx.fillStyle = "#fff2ce";
    ctx.beginPath();
    ctx.arc(1540, 164, 55, 0, Math.PI * 2);
    ctx.fill();

    function hill(color, y, offset) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let x = 0; x <= 2048; x += 8) {
        ctx.lineTo(
          x,
          y +
            Math.sin(x / 370 + offset) * 46 +
            Math.sin(x / 135 + offset) * 13
        );
      }

      ctx.lineTo(2048, 720);
      ctx.lineTo(0, 720);
      ctx.closePath();
      ctx.fill();
    }

    hill("#adc1b1", 395, 1);
    hill("#849f89", 472, 3);
    hill("#667f65", 560, 0);

    // Layered pine trees. No blur filter.
    for (let layer = 0; layer < 3; layer++) {
      ctx.fillStyle = [
        "#8fa895",
        "#69866f",
        "#47674f",
      ][layer];

      for (let index = 0; index < 42; index++) {
        const x =
          index * 52 +
          Math.sin(index * 9 + layer) * 22;

        const base =
          480 +
          layer * 86 +
          Math.sin(index * 1.7) * 25;

        const height =
          45 +
          layer * 30 +
          (Math.sin(index * 5 + layer) + 1) * 33;

        const width = height * 0.39;

        ctx.fillRect(
          x - 2,
          base - height * 0.5,
          4,
          height * 0.5
        );

        for (let tier = 0; tier < 4; tier++) {
          const top =
            base - height + tier * height * 0.16;

          const half =
            width * (0.32 + tier * 0.19);

          ctx.beginPath();
          ctx.moveTo(x, top);
          ctx.lineTo(x - half, top + height * 0.45);
          ctx.lineTo(x + half, top + height * 0.45);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    const texture = new CanvasTexture(canvas);

    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;

    material.current.map = texture;
    material.current.needsUpdate = true;

    return () => texture.dispose();
  }, []);

  return (
    <mesh position={[-0.3, 2.38, -2.915]}>
      <planeGeometry args={[3.98, 1.39]} />

      <meshBasicMaterial
        ref={material}
        toneMapped={false}
      />
    </mesh>
  );
}