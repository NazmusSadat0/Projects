import { useEffect, useRef } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

export default function PhoneScreen() {
  const material = useRef();

  useEffect(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d");

    const sky = ctx.createLinearGradient(0, 0, 0, 1024);

    sky.addColorStop(0, "#244e60");
    sky.addColorStop(0.58, "#8cadb1");
    sky.addColorStop(1, "#dfbc87");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 1024);

    // Sun.
    ctx.fillStyle = "#f0d4a3";
    ctx.beginPath();
    ctx.arc(385, 390, 69, 0, Math.PI * 2);
    ctx.fill();

    function hill(color, start, control, end) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, start);

      ctx.bezierCurveTo(
        160,
        control,
        330,
        end,
        512,
        start - 75
      );

      ctx.lineTo(512, 1024);
      ctx.lineTo(0, 1024);
      ctx.fill();
    }

    hill("#73947b", 690, 410, 790);
    hill("#3e695c", 785, 615, 870);
    hill("#244c46", 920, 700, 880);

    // Decorative clock.
    ctx.textAlign = "center";
    ctx.fillStyle = "#f7f3e9";

    ctx.font = "300 98px sans-serif";
    ctx.fillText("09:41", 256, 215);

    ctx.font = "23px sans-serif";
    ctx.fillText("MONDAY", 256, 260);

    // Camera cutout.
    ctx.fillStyle = "#142b34";
    ctx.beginPath();
    ctx.roundRect(176, 26, 160, 27, 14);
    ctx.fill();

    // App icons.
    const icons = [
      "#dfb477",
      "#82a99a",
      "#e8e0ce",
      "#a2bec4",
    ];

    icons.forEach((color, index) => {
      const x = 57 + index * 105;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, 868, 77, 77, 19);
      ctx.fill();

      ctx.strokeStyle = "#28463e";
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.roundRect(x + 23, 891, 31, 28, 6);
      ctx.stroke();
    });

    // Home indicator.
    ctx.fillStyle = "#f7f3e9";
    ctx.beginPath();
    ctx.roundRect(170, 988, 172, 7, 4);
    ctx.fill();

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;

    material.current.map = texture;
    material.current.needsUpdate = true;

    return () => texture.dispose();
  }, []);

  return (
    <group
      name="ContactScreen"
      position={[2, 1.45, -2.04]}
      rotation={[0, -0.12, 0]}
    >
      <mesh
        position={[0, 0.29, 0.036]}
        rotation={[-0.14, 0, 0]}
      >
        <planeGeometry args={[0.213, 0.423]} />

        <meshBasicMaterial
          ref={material}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}