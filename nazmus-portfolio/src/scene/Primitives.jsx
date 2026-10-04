import { useMemo } from "react";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function Box({
  size = [1, 1, 1],
  color = "#eee6d8",
  radius = 0.025,
  ...props
}) {
  const [x, y, z] = size;

  const geometry = useMemo(
    () =>
      new RoundedBoxGeometry(
        x,
        y,
        z,
        2,
        Math.min(radius, x / 3, y / 3, z / 3)
      ),
    [x, y, z, radius]
  );

  return (
    <mesh {...props} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.76} />
    </mesh>
  );
}

export function Cylinder({
  radius = 0.1,
  top = radius,
  height = 1,
  color = "#a56d44",
  ...props
}) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <cylinderGeometry args={[top, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

export function Sphere({ color = "#e8e0d0", ...props }) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color={color} roughness={0.68} />
    </mesh>
  );
}

export function Plant({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder
        radius={0.24}
        top={0.3}
        height={0.43}
        position={[0, 0.215, 0]}
        color="#dfcfb4"
      />

      <Cylinder
        radius={0.26}
        height={0.02}
        position={[0, 0.435, 0]}
        color="#494034"
      />

      <Cylinder
        radius={0.022}
        height={0.82}
        position={[0, 0.82, 0]}
        color="#536144"
      />

      {Array.from({ length: 9 }, (_, i) => {
        const angle = i * 2.4;
        const height = 0.64 + i * 0.077;

        return (
          <group
            key={i}
            position={[
              Math.sin(angle) * 0.19,
              height,
              Math.cos(angle) * 0.19,
            ]}
            rotation={[0, angle, -0.4]}
          >
            <Sphere
              scale={[0.13, 0.09, 0.37]}
              color={i % 2 ? "#677949" : "#405934"}
            />
          </group>
        );
      })}
    </group>
  );
}