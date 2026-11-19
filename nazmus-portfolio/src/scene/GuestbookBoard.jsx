import { useEffect, useState } from "react";
import { CanvasTexture, DoubleSide, SRGBColorSpace } from "three";

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function createGuestbookTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");

  // 1. Deep Studio Emerald Background
  const bg = ctx.createLinearGradient(0, 0, 768, 960);
  bg.addColorStop(0, "#14241c");
  bg.addColorStop(1, "#0b1510");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 768, 960);

  // Subtle architectural grid lines
  ctx.strokeStyle = "rgba(224, 182, 138, 0.07)";
  ctx.lineWidth = 2;
  for (let x = 48; x < 768; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 960);
    ctx.stroke();
  }
  for (let y = 48; y < 960; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(768, y);
    ctx.stroke();
  }

  // Outer Gold Border Frame
  ctx.strokeStyle = "rgba(224, 182, 138, 0.45)";
  ctx.lineWidth = 6;
  roundRect(ctx, 28, 28, 712, 904, 28);
  ctx.stroke();

  // 2. Header Section
  ctx.fillStyle = "#8fa698";
  ctx.font = "600 22px monospace";
  ctx.fillText("STUDIO // WALL OF LOVE", 64, 96);

  ctx.fillStyle = "#fffaf0";
  ctx.font = "700 54px sans-serif";
  ctx.fillText("Guestbook", 64, 162);

  // Rating Badge Pill
  ctx.fillStyle = "rgba(224, 182, 138, 0.16)";
  roundRect(ctx, 64, 192, 340, 56, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(224, 182, 138, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#e0b68a";
  ctx.font = "700 26px sans-serif";
  ctx.fillText("★★★★★  5.0 RATING", 90, 229);

  // 3. Pinned Review Cards
  const notes = [
    {
      y: 285,
      tilt: -0.025,
      author: "Tanvir Ahmed",
      quote: "“Best interactive 3D portfolio room.”",
      accent: "#4ade80",
    },
    {
      y: 475,
      tilt: 0.02,
      author: "Sarah Jenkins",
      quote: "“Love the warm lighting & smooth pan!”",
      accent: "#e0b68a",
    },
    {
      y: 665,
      tilt: -0.015,
      author: "Daniel Kim",
      quote: "“Super clean attention to detail.”",
      accent: "#61dafb",
    },
  ];

  notes.forEach((note) => {
    ctx.save();
    ctx.translate(384, note.y + 75);
    ctx.rotate(note.tilt);
    ctx.translate(-384, -(note.y + 75));

    // Card surface
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    roundRect(ctx, 64, note.y, 640, 152, 22);
    ctx.fill();

    ctx.strokeStyle = "rgba(245, 237, 223, 0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pin dot
    ctx.fillStyle = note.accent;
    ctx.beginPath();
    ctx.arc(384, note.y + 18, 7, 0, Math.PI * 2);
    ctx.fill();

    // Quote text
    ctx.fillStyle = "#fffaf0";
    ctx.font = "600 27px sans-serif";
    ctx.fillText(note.quote, 96, note.y + 74);

    // Author & stars
    ctx.fillStyle = "#9cb1a3";
    ctx.font = "500 22px monospace";
    ctx.fillText(`— ${note.author}`, 96, note.y + 120);

    ctx.fillStyle = "#e0b68a";
    ctx.fillText("★★★★★", 545, note.y + 120);

    ctx.restore();
  });

  // 4. Bottom Call-to-Action Footer
  ctx.fillStyle = "#e0b68a";
  roundRect(ctx, 64, 845, 640, 62, 16);
  ctx.fill();

  ctx.fillStyle = "#121e18";
  ctx.font = "700 24px monospace";
  ctx.textAlign = "center";
  ctx.fillText("CLICK BOARD TO SIGN & LEAVE A REVIEW →", 384, 884);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export default function GuestbookBoard() {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const tex = createGuestbookTexture();
    setTexture(tex);
    return () => tex.dispose();
  }, []);

  if (!texture) return null;

  return (
    <mesh
      name="Guestbook"
      position={[3.81, 2.45, -0.65]}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <planeGeometry args={[0.82, 1.04]} />
      <meshBasicMaterial
        map={texture}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}