import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import {
  useFrame,
  useLoader,
} from "@react-three/fiber";

import { BufferAttribute } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { getMaterialTextures } from "./materialTextures";
import useReducedMotion from "../hooks/useReducedMotion";

import AnimatedMonitor from "./AnimatedMonitor";
import PhoneScreen from "./PhoneScreen";
import WindowView from "./WindowView";

import AboutPhoto from "./AboutPhoto";

// Color, roughness, metalness.
const finishes = {
  Walnut: ["#98633f", 0.52, 0],
  DarkWalnut: ["#51362a", 0.6, 0],
  WarmPlaster: ["#e4e4dc", 0.95, 0],
  Linen: ["#e4ddce", 0.96, 0],
  SageFabric: ["#536754", 0.94, 0],
  Terracotta: ["#bd6035", 0.55, 0.08],
  GraphiteMetal: ["#263337", 0.42, 0.65],
  Brass: ["#b39a6d", 0.36, 0.7],
  Paper: ["#eee6d6", 0.95, 0],
  Soil: ["#302921", 1, 0],
  Leaves: ["#365b3e", 0.72, 0],
  WovenRug: ["#ad9877", 1, 0],
};

// Add texture coordinates to the supplied room model.
function addUVs(geometry) {
  const positions = geometry.attributes.position;

  if (!positions) return;

  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }

  const normals = geometry.attributes.normal;
  const uv = new Float32Array(positions.count * 2);

  for (let index = 0; index < positions.count; index++) {
    const nx = Math.abs(normals.getX(index));
    const ny = Math.abs(normals.getY(index));
    const nz = Math.abs(normals.getZ(index));

    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);

    uv[index * 2] = nx > ny && nx > nz ? z : x;

    uv[index * 2 + 1] =
      ny >= nx && ny >= nz ? z : y;
  }

  geometry.setAttribute(
    "uv",
    new BufferAttribute(uv, 2)
  );
}

export default function RoomModel({ onReady }) {
  
  const gltf = useLoader(GLTFLoader, "/models/room.glb", (loader) => {
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  loader.setDRACOLoader(draco);
});

  const [preparedScene, setPreparedScene] = useState(null);

  const foliage = useRef([]);
  const time = useRef(0);

  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const scene = gltf.scene.clone(true);

    const ownedMaterials = [];
    const ownedGeometry = [];
    const animatedLeaves = [];

    scene.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow =
        !object.name.startsWith("Architecture_");

      object.receiveShadow = true;

      const sourceMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      let needsTextures = false;
      let hasLeaves = false;

      const clonedMaterials = sourceMaterials.map((source) => {
        const material = source.clone();

        ownedMaterials.push(material);

        const finish = finishes[material.name];

        if (finish) {
          material.color.set(finish[0]);
          material.roughness = finish[1];
          material.metalness = finish[2];
        }

        const wood = [
          "Walnut",
          "DarkWalnut",
        ].includes(material.name);

        const fabric = [
          "Linen",
          "SageFabric",
          "WovenRug",
        ].includes(material.name);

        if (wood || fabric) {
          needsTextures = true;

          const textures = getMaterialTextures(
            wood ? "wood" : "fabric"
          );

          material.map = textures.color;
          material.bumpMap = textures.bump;
          material.bumpScale = wood ? 0.002 : 0.0015;
        }

        if (material.name === "Leaves") {
          hasLeaves = true;
        }

        material.needsUpdate = true;

        return material;
      });

      object.material = Array.isArray(object.material)
        ? clonedMaterials
        : clonedMaterials[0];

      if (needsTextures) {
        const geometry = object.geometry.clone();

        addUVs(geometry);

        object.geometry = geometry;
        ownedGeometry.push(geometry);
      }

      if (hasLeaves) {
        animatedLeaves.push({
          object,
          initialX: object.rotation.x,
          initialZ: object.rotation.z,
        });
      }
    });

    foliage.current = animatedLeaves;
    setPreparedScene(scene);

    return () => {
      foliage.current = [];

      ownedMaterials.forEach((material) => {
        material.dispose();
      });

      ownedGeometry.forEach((geometry) => {
        geometry.dispose();
      });
    };
  }, [gltf.scene]);

  // Notify the parent after React mounts the prepared model.
  useLayoutEffect(() => {
    if (preparedScene) {
      onReady?.();
    }
  }, [preparedScene, onReady]);

  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);

    foliage.current.forEach(
      ({ object, initialX, initialZ }, index) => {
        const swayZ = reduced
          ? 0
          : Math.sin(
              time.current * 1.8 + index * 1.8
            ) * 0.025;

        const swayX = reduced
          ? 0
          : Math.sin(
              time.current * 1.25 + index
            ) * 0.016;

        object.rotation.z = initialZ + swayZ;
        object.rotation.x = initialX + swayX;
      }
    );
  });

  return (
    <group>
      {preparedScene && (
        <primitive
          object={preparedScene}
          dispose={null}
        />
      )}

      <AnimatedMonitor />
      <PhoneScreen />
      <WindowView />
      <AboutPhoto />

      <pointLight
        position={[-1.72, 2.16, -2.09]}
        color="#ffd7a5"
        intensity={2.2}
        distance={3.2}
        decay={2}
      />
    </group>
  );
}