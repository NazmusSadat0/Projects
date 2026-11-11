import { useEffect, useState } from "react";
import { DoubleSide, SRGBColorSpace, TextureLoader } from "three";

// If your file is named sadat.jpg instead of sadat.jpeg, change the extension below:
import sadatImg from "../assets/sadat.jpeg";

export default function AboutPhoto() {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    let loadedTexture = null;

    loader.load(
      sadatImg,
      (tex) => {
        tex.colorSpace = SRGBColorSpace;
        tex.needsUpdate = true;
        loadedTexture = tex;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load About photo:", err);
      }
    );

    return () => {
      if (loadedTexture) loadedTexture.dispose();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh
      name="AboutMe"
      // X = -3.81 places the photo cleanly in front of the frame mount (-3.82)
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