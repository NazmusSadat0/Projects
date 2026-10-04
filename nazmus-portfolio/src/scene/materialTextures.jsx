import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

const cache = new Map();

function random(seed = 17) {
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function canvas(size) {
  const element = document.createElement("canvas");
  element.width = element.height = size;
  return [element, element.getContext("2d")];
}

function texture(element, color = false) {
  const result = new CanvasTexture(element);

  if (color) result.colorSpace = SRGBColorSpace;

  result.wrapS = result.wrapT = RepeatWrapping;
  result.anisotropy = 4;

  return result;
}

export function getMaterialTextures(type) {
  if (cache.has(type)) return cache.get(type);

  const [element, ctx] = canvas(1024);
  const rng = random(43);
  const image = ctx.createImageData(1024, 1024);

  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const index = (y * 1024 + x) * 4;
      let value;

      if (type === "wood") {
        const wave =
          y + 3 * Math.sin(x / 170) + 1.2 * Math.sin(x / 61);

        value =
          229 +
          5 * Math.sin(wave * 0.66) +
          3 * Math.sin(wave * 2.3) +
          (rng() - 0.5) * 5;
      } else {
        value =
          236 +
          5 *
            Math.sin((x * Math.PI) / 2) *
            Math.sin((y * Math.PI) / 2) +
          (rng() - 0.5) * 9;
      }

      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const result = {
    color: texture(element, true),
    bump: texture(element),
  };

  cache.set(type, result);
  return result;
}

export function getSceneTexture(type) {
  const key = `scene-${type}`;
  if (cache.has(key)) return cache.get(key);

  const [element, ctx] = canvas(1024);
  const rng = random(123);

  if (type === "screen") {
    ctx.fillStyle = "#1c282d";
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = "#25363d";
    ctx.fillRect(0, 0, 1024, 75);
    ctx.fillRect(0, 75, 195, 949);

    ctx.font = "24px monospace";
    ctx.fillStyle = "#b5c2c3";
    ctx.fillText("room.jsx", 235, 48);

    ctx.font = "18px monospace";
    ctx.fillText("EXPLORER", 20, 120);

    [
      "src",
      "  scene",
      "  components",
      "  styles",
      "package.json",
    ].forEach((line, index) => {
      ctx.fillText(line, 20, 173 + index * 38);
    });

    const lines = [
      "// A space for ideas",
      "",
      "function MyRoom() {",
      "  return (",
      "    <Scene>",
      "      <Projects />",
      "      <Experiments />",
      "      <SomethingNew />",
      "    </Scene>",
      "  );",
      "}",
      "",
      "export default MyRoom;",
    ];

    ctx.font = "25px monospace";

    lines.forEach((line, index) => {
      ctx.fillStyle = "#596e75";
      ctx.fillText(String(index + 1), 213, 150 + index * 48);

      ctx.fillStyle = ["#95b5a4", "#d7c49d", "#cc956c"][index % 3];
      ctx.fillText(line, 267, 150 + index * 48);
    });

    ctx.fillStyle = "#30494b";
    ctx.fillRect(0, 972, 1024, 52);

    ctx.fillStyle = "#b5c4bd";
    ctx.font = "20px monospace";
    ctx.fillText(
      "JavaScript     UTF-8                                      main",
      22,
      1005
    );
  } else {
    const sky = ctx.createLinearGradient(0, 0, 0, 1024);
    sky.addColorStop(0, "#b3ced4");
    sky.addColorStop(0.65, "#e8e1c8");
    sky.addColorStop(1, "#c3c9ad");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.filter = "blur(14px)";

    for (let index = 0; index < 200; index++) {
      const x = rng() * 1250 - 100;
      const y = 400 + rng() * 780;

      ctx.fillStyle = [
        "#879873",
        "#647f65",
        "#b1b789",
        "#97a788",
        "#c6c9a1",
      ][index % 5];

      ctx.globalAlpha = 0.35 + rng() * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, 18 + rng() * 85, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }

  const result = texture(element, true);
  cache.set(key, result);
  return result;
}