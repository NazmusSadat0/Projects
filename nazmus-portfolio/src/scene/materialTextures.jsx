import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

const cache = new Map();
const TEXTURE_SIZE = 256;

function random(seed = 17) {
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function createCanvas(size) {
  const element = document.createElement("canvas");
  element.width = element.height = size;
  return [element, element.getContext("2d")];
}

function createTexture(element, color = false) {
  const result = new CanvasTexture(element);

  if (color) result.colorSpace = SRGBColorSpace;

  result.wrapS = result.wrapT = RepeatWrapping;
  result.anisotropy = 4;

  return result;
}

export function getMaterialTextures(type) {
  if (cache.has(type)) return cache.get(type);

  const [element, ctx] = createCanvas(TEXTURE_SIZE);
  const rng = random(43);
  const image = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const index = (y * TEXTURE_SIZE + x) * 4;
      let value;

      if (type === "wood") {
        const wave =
          y * 4 +
          3 * Math.sin((x * 4) / 170) +
          1.2 * Math.sin((x * 4) / 61);

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
    color: createTexture(element, true),
    bump: createTexture(element),
  };

  cache.set(type, result);
  return result;
}