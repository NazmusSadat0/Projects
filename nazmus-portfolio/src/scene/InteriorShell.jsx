import { Box } from "./Primitives";

const ROOM_HEIGHT = 4.2;

const WALL_COLOR = "#eee6d8";
const LEFT_WALL_COLOR = "#e4dac7";
const TRIM_COLOR = "#d9cbb5";
const WOOD_COLOR = "#aa754d";

function Wall({
  size,
  position,
  color = WALL_COLOR,
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={size} />

      <meshStandardMaterial
        color={color}
        roughness={0.95}
      />
    </mesh>
  );
}

function FramedArtwork({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Wooden frame */}
      <Box
        size={[0.9, 1.12, 0.065]}
        color={WOOD_COLOR}
        radius={0.012}
      />

      {/* Cream mount */}
      <Box
        size={[0.8, 1.02, 0.014]}
        position={[0, 0, 0.04]}
        color="#f3ebdc"
        radius={0.002}
      />

      {/* Artwork background */}
      <Box
        size={[0.65, 0.85, 0.008]}
        position={[0, 0, 0.052]}
        color="#e5d6ba"
        radius={0.002}
      />

      {/* Sun */}
      <mesh position={[0.12, 0.18, 0.06]}>
        <circleGeometry args={[0.15, 40]} />
        <meshBasicMaterial color="#bf7949" />
      </mesh>

      {/* Landscape */}
      <Box
        size={[0.59, 0.18, 0.008]}
        position={[0, -0.28, 0.06]}
        color="#899579"
        radius={0.002}
      />
    </group>
  );
}

function EntranceDoor() {
  return (
    <group position={[0, 0, 2.91]}>
      {/* Outer frame */}
      <Box
        size={[1.54, 2.67, 0.07]}
        position={[0, 1.335, 0]}
        color="#90704f"
        radius={0.015}
      />

      {/* Door */}
      <Box
        size={[1.34, 2.48, 0.055]}
        position={[0, 1.245, -0.047]}
        color="#b28b60"
        radius={0.012}
      />

      {/* Upper inset */}
      <Box
        size={[1.1, 0.95, 0.018]}
        position={[0, 1.83, -0.084]}
        color="#a68159"
        radius={0.01}
      />

      {/* Lower inset */}
      <Box
        size={[1.1, 0.85, 0.018]}
        position={[0, 0.64, -0.084]}
        color="#a68159"
        radius={0.01}
      />

      {/* Handle */}
      <mesh position={[0.46, 1.22, -0.13]}>
        <sphereGeometry args={[0.047, 20, 14]} />

        <meshStandardMaterial
          color="#bca36f"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default function InteriorShell() {
  // These match the walls already created in Room.jsx.
  const existingRearHeight = 3.4;
  const existingLeftHeight = 2.8;

  const rearExtension =
    ROOM_HEIGHT - existingRearHeight;

  const leftExtension =
    ROOM_HEIGHT - existingLeftHeight;

  return (
    <group>
      {/* Full-height right wall */}
      <Wall
        size={[0.16, ROOM_HEIGHT, 6.16]}
        position={[4, ROOM_HEIGHT / 2, 0]}
      />

      {/* Full-height wall behind the visitor */}
      <Wall
        size={[8.16, ROOM_HEIGHT, 0.16]}
        position={[0, ROOM_HEIGHT / 2, 3.08]}
      />

      {/* Extend the existing rear wall upward */}
      <Wall
        size={[8.1, rearExtension, 0.16]}
        position={[
          0,
          existingRearHeight + rearExtension / 2,
          -3,
        ]}
      />

      {/* Extend the existing left wall upward */}
      <Wall
        size={[0.16, leftExtension, 6.16]}
        position={[
          -4,
          existingLeftHeight + leftExtension / 2,
          0,
        ]}
        color={LEFT_WALL_COLOR}
      />

      {/* Raised ceiling */}
      <Wall
        size={[8.16, 0.14, 6.24]}
        position={[0, ROOM_HEIGHT + 0.07, 0]}
        color="#f2ebde"
      />

      {/* Right skirting board */}
      <Box
        size={[0.055, 0.14, 6]}
        position={[3.89, 0.08, 0]}
        color={WOOD_COLOR}
        radius={0.008}
      />

      {/* Entrance skirting boards */}
      {[-1, 1].map((side) => (
        <Box
          key={`skirting-${side}`}
          size={[3.2, 0.14, 0.055]}
          position={[side * 2.4, 0.08, 2.96]}
          color={WOOD_COLOR}
          radius={0.008}
        />
      ))}

      {/* Raised ceiling trim: front and rear */}
      {[-1, 1].map((side) => (
        <Box
          key={`trim-horizontal-${side}`}
          size={[7.9, 0.095, 0.08]}
          position={[
            0,
            ROOM_HEIGHT - 0.055,
            side * 2.93,
          ]}
          color={TRIM_COLOR}
          radius={0.01}
        />
      ))}

      {/* Raised ceiling trim: left and right */}
      {[-1, 1].map((side) => (
        <Box
          key={`trim-side-${side}`}
          size={[0.08, 0.095, 5.86]}
          position={[
            side * 3.89,
            ROOM_HEIGHT - 0.055,
            0,
          ]}
          color={TRIM_COLOR}
          radius={0.01}
        />
      ))}

      {/* Picture on the right wall */}
      <FramedArtwork
        position={[3.88, 2.45, -0.65]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Larger picture above the bookshelf */}
      <FramedArtwork
        position={[-3.88, 2.35, -0.65]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1.15}
      />

      <EntranceDoor />
    </group>
  );
}