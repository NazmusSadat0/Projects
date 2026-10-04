import { Box, Cylinder } from "./Primitives";

export default function RoomDetails() {
  return (
    <group>
      {/* Headphones */}
      <group
        position={[-1.42, 1.51, -1.66]}
        rotation={[-Math.PI / 2, 0, -0.2]}
        scale={0.72}
      >
        <mesh castShadow>
          <torusGeometry args={[0.24, 0.035, 12, 40, Math.PI]} />
          <meshStandardMaterial color="#3d443c" roughness={0.78} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.24, 0, 0]}>
            <Box
              size={[0.11, 0.2, 0.14]}
              color="#444b43"
              radius={0.045}
            />
            <Box
              size={[0.055, 0.17, 0.12]}
              position={[-side * 0.05, 0, 0]}
              color="#747c6d"
              radius={0.025}
            />
          </group>
        ))}
      </group>

      {/* Rug borders */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            size={[3.29, 0.005, 0.026]}
            position={[-0.65, 0.054, -0.15 + side * 1.025]}
            color="#bba987"
          />
          <Box
            size={[0.026, 0.005, 2.07]}
            position={[-0.65 + side * 1.63, 0.054, -0.15]}
            color="#bba987"
          />
        </group>
      ))}

      {/* Rug fringe */}
      {Array.from({ length: 34 }, (_, index) =>
        [-1, 1].map((side) => (
          <Box
            key={`${index}-${side}`}
            size={[0.025, 0.009, 0.13]}
            position={[
              -2.28 + index * 0.099,
              0.035,
              -0.15 + side * 1.17,
            ]}
            color="#d2be9b"
          />
        ))
      )}

      {/* Pencil holder */}
      <Cylinder
        radius={0.095}
        height={0.2}
        position={[1.58, 1.54, -2.45]}
        color="#bca481"
      />

      {[0, 1, 2].map((index) => (
        <Cylinder
          key={index}
          radius={0.009}
          height={0.34}
          position={[1.54 + index * 0.04, 1.68, -2.45]}
          rotation={[0, 0, (index - 1) * 0.12]}
          color={["#444d42", "#c57943", "#6c7e75"][index]}
        />
      ))}

      {/* Notebook */}
      <group
        position={[-1.73, 1.468, -2.5]}
        rotation={[0, 0.12, 0]}
      >
        <Box
          size={[0.43, 0.055, 0.3]}
          color="#d4c4a5"
          radius={0.012}
        />
        <Box
          size={[0.39, 0.025, 0.28]}
          position={[0.009, 0.008, 0]}
          color="#eee4ce"
        />
      </group>

      {/* Monitor indicator */}
      <mesh position={[0.54, 1.78, -2.183]}>
        <sphereGeometry args={[0.008, 12, 8]} />
        <meshBasicMaterial color="#94d5bf" />
      </mesh>
    </group>
  );
}