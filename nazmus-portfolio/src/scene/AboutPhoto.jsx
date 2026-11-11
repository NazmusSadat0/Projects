import { useEffect, useState } from "react";
import { DoubleSide, SRGBColorSpace, TextureLoader } from "three";

// Keep this import if your photo is inside src/assets/sadat.jpeg:
import sadatImg from "../assets/Sadat.jpeg";

export default function AboutPhoto() {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    let activeTexture = null;

    loader.load(
      sadatImg,
      (loaded) => {
        loaded.colorSpace = SRGBColorSpace;
        loaded.needsUpdate = true;
        activeTexture = loaded;
        setTexture(loaded);
      },
      undefined,
      () => {
        // Fallback: try /sadat.jpeg from public/ without crashing the room
        loader.load(
          "/sadat.jpeg",
          (fallbackTex) => {
            fallbackTex.colorSpace = SRGBColorSpace;
            fallbackTex.needsUpdate = true;
            activeTexture = fallbackTex;
            setTexture(fallbackTex);
          },
          undefined,
          (err) => console.warn("Photo could not load:", err)
        );
      }
    );

    return () => {
      if (activeTexture) activeTexture.dispose();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh
      name="AboutMe"
      position={[-3.81, 2.35, -0.65]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <planeGeometry args={[0.75, 0.98]} />
      <meshBasicMaterial
        map={texture}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}