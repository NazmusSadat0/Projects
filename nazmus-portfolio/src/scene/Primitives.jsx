import { useMemo } from "react";
import {
  DoubleSide,
  Shape,
  ShapeGeometry,
  BoxGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { getMaterialTextures } from "./materialTextures";

const woodColors = new Set([
  "#aa754d",
  "#785136",
  "#c7986c",
  "#bd8d60",
  "#c39468",
  "#cda277",
]);

const fabricColors = new Set([
  "#899077",
  "#e5d6bc",
  "#c76b37",
  "#d6c4a5",
]);

function SurfaceMaterial({ color, surface }) {
  const normalizedColor = color.toLowerCase();

  const materialType =
    surface ||
    (woodColors.has(normalizedColor)
      ? "wood"
      : fabricColors.has(normalizedColor)
        ? "fabric"
        : null);

  const textures = useMemo(
    () => (materialType ? getMaterialTextures(materialType) : null),
    [materialType]
  );

  return (
    <meshStandardMaterial
      color={color}
      map={textures?.color ?? null}
      bumpMap={textures?.bump ?? null}
      bumpScale={materialType ? 0.002 : 0}
      roughness={
        materialType === "wood"
          ? 0.57
          : materialType === "fabric"
            ? 0.96
            : 0.7
      }
    />
  );
}

export function Box({
  size = [1, 1, 1],
  color = "#eee6d8",
  radius = 0.025,
  surface,
  ...props
}) {
  const [x, y, z] = size;
  const wall =
    Math.max(x, y, z) >= 6 && Math.min(x, y, z) <= 0.17;

  const geometry = useMemo(
    () =>
      wall
        ? new BoxGeometry(x, y, z)
        : new RoundedBoxGeometry(
            x,
            y,
            z,
            3,
            Math.min(radius, x / 3, y / 3, z / 3)
          ),
    [x, y, z, radius, wall]
  );

  return (
    <mesh
      {...props}
      geometry={geometry}
      castShadow={!wall}
      receiveShadow
    >
      <SurfaceMaterial color={color} surface={surface} />
    </mesh>
  );
}

export function Cylinder({
  radius = 0.1,
  top = radius,
  height = 1,
  color = "#a56d44",
  surface,
  ...props
}) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <cylinderGeometry args={[top, radius, height, 40]} />
      <SurfaceMaterial color={color} surface={surface} />
    </mesh>
  );
}

export function Sphere({ color = "#e8e0d0", ...props }) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 20]} />
      <SurfaceMaterial color={color} />
    </mesh>
  );
}

function Leaf({ color }) {
  const shape = useMemo(() => {
    const leaf = new Shape();

    leaf.moveTo(0, 0);
    leaf.bezierCurveTo(-0.19, 0.15, -0.18, 0.38, 0, 0.6);
    leaf.bezierCurveTo(0.18, 0.38, 0.19, 0.15, 0, 0);

    return leaf;
  }, []);

  const geometry = useMemo(() => {
    const result = new ShapeGeometry(shape, 20);
    const vertices = result.attributes.position;

    for (let index = 0; index < vertices.count; index++) {
      const x = vertices.getX(index);
      const y = vertices.getY(index);

      vertices.setZ(
        index,
        Math.sin((y / 0.6) * Math.PI) * 0.045 -
          Math.abs(x) * 0.32
      );
    }

    vertices.needsUpdate = true;
    result.computeVertexNormals();

    return result;
  }, [shape]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          side={DoubleSide}
        />
      </mesh>

      <Cylinder
        radius={0.005}
        height={0.47}
        position={[0, 0.25, 0.008]}
        color="#96a56e"
      />
    </group>
  );
}

export function Plant({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder
        radius={0.23}
        top={0.29}
        height={0.43}
        position={[0, 0.215, 0]}
        color="#ddceb7"
      />

      <mesh
        position={[0, 0.43, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <torusGeometry args={[0.282, 0.018, 10, 40]} />
        <meshStandardMaterial color="#e5d8c2" roughness={0.8} />
      </mesh>

      <Cylinder
        radius={0.263}
        height={0.02}
        position={[0, 0.426, 0]}
        color="#493d2c"
      />

      <Cylinder
        radius={0.015}
        height={0.93}
        position={[0, 0.91, 0]}
        color="#62744b"
      />

      {Array.from({ length: 11 }, (_, index) => {
        const angle = index * 2.399;
        const height = 0.48 + index * 0.073;

        return (
          <group
            key={index}
            position={[0, height, 0]}
            rotation={[0, angle, 0]}
          >
            <group rotation={[0, 0, -0.9]}>
              <Cylinder
                radius={0.007}
                height={0.24}
                position={[0, 0.12, 0]}
                color="#748551"
              />

              <group
                position={[0, 0.18, 0]}
                rotation={[0.14, 0.25, 0]}
                scale={0.68 + (index % 3) * 0.12}
              >
                <Leaf
                  color={
                    ["#496335", "#607943", "#71884c"][index % 3]
                  }
                />
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
}