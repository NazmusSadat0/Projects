import { useLayoutEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { getSceneTexture } from "./materialTextures";

export default function RoomModel() {
  const gltf = useLoader(GLTFLoader, "/models/room.glb");

  const scene = useMemo(
    () => gltf.scene.clone(true),
    [gltf.scene]
  );

  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;

      // Large architectural surfaces receive shadows.
      // Furniture also casts shadows.
      object.castShadow =
        !object.name.startsWith("Architecture_");

      object.receiveShadow = true;
    });
  }, [scene]);

  return (
    <group>
      {/* Complete room asset */}
      <primitive
        object={scene}
        dispose={null}
      />

      {/* Monitor display */}
      <mesh position={[-0.25, 2.24, -2.16]}>
        <planeGeometry args={[1.76, 0.94]} />

        <meshBasicMaterial
          map={getSceneTexture("screen")}
          toneMapped={false}
        />
      </mesh>

      {/* View through the window */}
      <mesh position={[-0.3, 2.38, -2.915]}>
        <planeGeometry args={[3.98, 1.39]} />

        <meshBasicMaterial
          map={getSceneTexture("window")}
          toneMapped={false}
        />
      </mesh>

      {/* Warm light beneath the desk lamp */}
      <pointLight
        position={[-1.72, 2.16, -2.09]}
        color="#ffd19a"
        intensity={1.7}
        distance={2.8}
        decay={2}
      />
    </group>
  );
}