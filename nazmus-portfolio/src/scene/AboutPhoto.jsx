import { useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";

export default function AboutPhoto() {
  const texture = useLoader(TextureLoader, "/sadat.jpeg");
  texture.colorSpace = SRGBColorSpace;

  return (
    <mesh
      name="AboutMe"
      // Positioned right inside the frame on the left wall, facing inward (+X)
      position={[-3.865, 2.35, -0.65]}
      rotation={[0, Math.PI / 2, 0]}
    >
      {/* 3:4 portrait aspect ratio (width: 0.75, height: 1.0) */}
      <planeGeometry args={[0.75, 1.0]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
      />
    </mesh>
  );
}