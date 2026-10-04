import { Box, Cylinder, Sphere, Plant } from "./Primitives";

const wood = "#aa754d";
const darkWood = "#785136";

function Shell() {
  return (
    <group>
      {/* Floor platform */}
      <Box
        size={[8.2, 0.28, 6.2]}
        position={[0, -0.16, 0]}
        color={darkWood}
        radius={0.07}
      />

      {/* Individual floorboards */}
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={i}
          size={[0.397, 0.035, 6]}
          position={[-3.8 + i * 0.4, 0, 0]}
          color={["#c7986c", "#bd8d60", "#c39468", "#cda277"][i % 4]}
          radius={0.005}
        />
      ))}

      {/* Rear wall: separate pieces around the window */}
      <Box
        size={[8.1, 1.65, 0.16]}
        position={[0, 0.825, -3]}
      />

      <Box
        size={[8.1, 0.25, 0.16]}
        position={[0, 3.275, -3]}
      />

      <Box
        size={[1.8, 1.5, 0.16]}
        position={[-3.15, 2.4, -3]}
      />

      <Box
        size={[2.4, 1.5, 0.16]}
        position={[2.85, 2.4, -3]}
      />

      {/* Left wall */}
      <Box
        size={[0.16, 2.8, 6]}
        position={[-4, 1.4, 0]}
        color="#e4dac7"
      />

      {/* Skirting boards */}
      <Box
        size={[8, 0.14, 0.09]}
        position={[0, 0.08, -2.88]}
        color={wood}
      />

      <Box
        size={[0.09, 0.14, 6]}
        position={[-3.89, 0.08, 0]}
        color={wood}
      />

      {/* Window frame */}
      <Box
        size={[4.02, 1.61, 0.2]}
        position={[-0.3, 2.4, -3.04]}
        color={darkWood}
      />

      {/* Sky-colored window */}
      <mesh position={[-0.3, 2.4, -2.929]}>
        <planeGeometry args={[3.8, 1.38]} />
        <meshBasicMaterial color="#b5d3da" />
      </mesh>

      <Box
        size={[4.12, 0.09, 0.34]}
        position={[-0.3, 1.62, -2.9]}
        color={wood}
      />

      <Box
        size={[0.055, 1.4, 0.05]}
        position={[-0.3, 2.4, -2.87]}
        color={wood}
      />

      {/* Abstract framed artwork */}
      <Box
        size={[1.15, 1.32, 0.1]}
        position={[2.85, 2.3, -2.86]}
        color={wood}
      />

      <Box
        size={[1, 1.17, 0.03]}
        position={[2.85, 2.3, -2.79]}
        color="#f1ddbe"
      />

      <mesh position={[3.02, 2.55, -2.768]}>
        <circleGeometry args={[0.22, 40]} />
        <meshBasicMaterial color="#c87943" />
      </mesh>

      <Box
        size={[0.84, 0.28, 0.025]}
        position={[2.85, 1.94, -2.76]}
        color="#8b9472"
      />
    </group>
  );
}

function Computer() {
  return (
    <group position={[-0.25, 1.44, -2.22]}>
      {/* Monitor base */}
      <Box
        size={[0.58, 0.045, 0.37]}
        position={[0, 0.035, 0.06]}
        color="#343632"
      />

      <Box
        size={[0.12, 0.37, 0.12]}
        position={[0, 0.21, 0]}
        color="#343632"
      />

      {/* Monitor body */}
      <Box
        size={[1.85, 1.03, 0.1]}
        position={[0, 0.79, 0]}
        color="#252b2b"
        radius={0.04}
      />

      {/* Screen */}
      <mesh position={[0, 0.79, 0.056]}>
        <planeGeometry args={[1.73, 0.91]} />
        <meshBasicMaterial color="#18292d" />
      </mesh>

      {/* Decorative code lines */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh
          key={i}
          position={[
            -0.54 + (i % 3) * 0.07,
            1.12 - i * 0.064,
            0.06,
          ]}
        >
          <planeGeometry args={[0.34 + (i % 4) * 0.15, 0.018]} />
          <meshBasicMaterial
            color={["#d79367", "#9abdb2", "#ddc997"][i % 3]}
          />
        </mesh>
      ))}

      {/* Keyboard */}
      <Box
        size={[1.13, 0.055, 0.39]}
        position={[0, 0.032, 0.67]}
        color="#e5dfcf"
      />

      {Array.from({ length: 36 }, (_, i) => (
        <Box
          key={i}
          size={[0.07, 0.013, 0.065]}
          position={[
            -0.49 + (i % 12) * 0.089,
            0.066,
            0.55 + Math.floor(i / 12) * 0.1,
          ]}
          color="#bfb9aa"
          radius={0.006}
        />
      ))}

      {/* Mouse */}
      <Sphere
        position={[0.89, 0.055, 0.64]}
        scale={[0.1, 0.05, 0.16]}
        color="#eee9dc"
      />
    </group>
  );
}

function Robot() {
  return (
    <group position={[1.15, 1.45, -2.2]}>
      <Sphere
        position={[0, 0.19, 0]}
        scale={[0.16, 0.2, 0.12]}
      />

      <Box
        position={[0, 0.43, 0]}
        size={[0.36, 0.29, 0.25]}
        radius={0.09}
        color="#eee9db"
      />

      <Box
        position={[0, 0.43, 0.127]}
        size={[0.27, 0.17, 0.025]}
        radius={0.04}
        color="#243a40"
      />

      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Eye */}
          <Sphere
            position={[side * 0.07, 0.44, 0.145]}
            scale={[0.027, 0.04, 0.014]}
            color="#8de3e6"
          />

          {/* Foot */}
          <Sphere
            position={[side * 0.11, 0.038, 0.065]}
            scale={[0.085, 0.045, 0.12]}
          />

          {/* Arm */}
          <Sphere
            position={[side * 0.2, 0.22, 0]}
            scale={[0.058, 0.12, 0.055]}
          />
        </group>
      ))}
    </group>
  );
}

function Desk() {
  return (
    <group>
      {/* Desktop */}
      <Box
        size={[5.15, 0.14, 1.3]}
        position={[0.05, 1.37, -2.02]}
        color={wood}
        radius={0.045}
      />

      {/* Left support */}
      <Box
        size={[0.15, 1.3, 1.15]}
        position={[-2.43, 0.65, -2.02]}
        color={darkWood}
      />

      {/* Drawer cabinet */}
      <Box
        size={[1.02, 1.25, 1.15]}
        position={[2.05, 0.63, -2.02]}
        color="#747765"
      />

      {[0.23, 0.64, 1.05].map((height) => (
        <group key={height}>
          <Box
            size={[0.94, 0.38, 0.04]}
            position={[2.05, height, -1.423]}
            color="#878975"
          />

          <Box
            size={[0.35, 0.025, 0.04]}
            position={[2.05, height + 0.08, -1.392]}
            color="#4d5146"
          />
        </group>
      ))}

      <Computer />
      <Robot />

      {/* Phone and stand */}
      <group
        position={[2, 1.45, -2.04]}
        rotation={[-0.14, -0.12, 0]}
      >
        <Box
          size={[0.31, 0.05, 0.27]}
          color={darkWood}
        />

        <Box
          size={[0.25, 0.48, 0.045]}
          position={[0, 0.25, 0]}
          color="#252c2e"
        />

        <Box
          size={[0.21, 0.4, 0.008]}
          position={[0, 0.26, 0.028]}
          color="#80a6ac"
        />
      </group>

      {/* Lamp base */}
      <Cylinder
        radius={0.22}
        height={0.055}
        position={[-1.95, 1.46, -2.12]}
        color="#c86d36"
      />

      {/* Lamp stem */}
      <Cylinder
        radius={0.025}
        height={0.91}
        position={[-1.95, 1.94, -2.12]}
        color="#9f572f"
      />

      {/* Lamp shade */}
      <group
        position={[-1.76, 2.4, -2.04]}
        rotation={[0, 0, -0.4]}
      >
        <Cylinder
          radius={0.23}
          top={0.1}
          height={0.24}
          color="#c86d36"
        />
      </group>

      <pointLight
        position={[-1.7, 2.22, -1.9]}
        intensity={2}
        color="#ffd19a"
        distance={3}
      />

      <Plant
        position={[-1.25, 1.45, -2.35]}
        scale={0.4}
      />
    </group>
  );
}

function Chair() {
  return (
    <group
      position={[-0.75, 0, -0.45]}
      rotation={[0, -0.36, 0]}
    >
      <Cylinder
        radius={0.06}
        height={0.58}
        position={[0, 0.36, 0]}
        color="#42483f"
      />

      {/* Five-legged base */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <Box
            size={[0.055, 0.055, 0.54]}
            position={[0, 0.14, 0.23]}
            color="#42483f"
          />

          <Sphere
            position={[0, 0.1, 0.47]}
            scale={[0.07, 0.08, 0.07]}
            color="#343b35"
          />
        </group>
      ))}

      {/* Seat */}
      <Box
        size={[0.87, 0.18, 0.8]}
        position={[0, 0.71, 0]}
        color="#899077"
        radius={0.08}
      />

      {/* Backrest */}
      <Box
        size={[0.87, 0.8, 0.16]}
        position={[0, 1.08, 0.37]}
        color="#899077"
        radius={0.07}
      />

      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            size={[0.045, 0.3, 0.045]}
            position={[side * 0.49, 0.84, 0]}
            color={darkWood}
          />

          <Box
            size={[0.13, 0.08, 0.55]}
            position={[side * 0.49, 1, -0.04]}
            color={wood}
          />
        </group>
      ))}
    </group>
  );
}

function Shelf() {
  return (
    <group position={[-3.5, 0, -0.72]}>
      {/* Horizontal shelves */}
      {[0.15, 0.75, 1.4].map((height) => (
        <Box
          key={height}
          size={[0.78, 0.09, 3.6]}
          position={[0, height, 0]}
          color={wood}
        />
      ))}

      {/* Vertical dividers */}
      {[-1.75, -0.55, 0.6, 1.75].map((depth) => (
        <Box
          key={depth}
          size={[0.75, 1.3, 0.07]}
          position={[0, 0.76, depth]}
          color={wood}
        />
      ))}

      {/* Upper books */}
      {Array.from({ length: 16 }, (_, i) => {
        const bookHeight = 0.34 + (i % 3) * 0.06;

        return (
          <Box
            key={i}
            size={[0.51, bookHeight, 0.09]}
            position={[
              0.035,
              0.8 + bookHeight / 2,
              -1.6 + i * 0.14,
            ]}
            color={["#d3c5a5", "#718375", "#b97c51", "#e5d7be"][i % 4]}
          />
        );
      })}

      {/* Lower books */}
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          size={[0.54, 0.39, 0.13]}
          position={[0.035, 0.39, 0.72 + i * 0.14]}
          color={i % 2 ? "#778978" : "#d0ae80"}
        />
      ))}

      <Plant
        position={[0, 1.45, -1.22]}
        scale={0.6}
      />

      <Sphere
        position={[0, 1.62, 0.6]}
        scale={[0.16, 0.18, 0.16]}
        color="#dcc8a3"
      />
    </group>
  );
}

function Lounge() {
  return (
    <group
      position={[2.6, 0, 0.65]}
      rotation={[0, -0.28, 0]}
    >
      {/* Chair legs */}
      {[-0.43, 0.43].flatMap((x) =>
        [-0.36, 0.36].map((z) => (
          <Cylinder
            key={`${x},${z}`}
            radius={0.045}
            height={0.29}
            position={[x, 0.145, z]}
            color={darkWood}
          />
        ))
      )}

      {/* Seat */}
      <Box
        size={[1.1, 0.33, 1]}
        position={[0, 0.43, 0]}
        color="#e5d6bc"
        radius={0.14}
      />

      {/* Back */}
      <Box
        size={[1.18, 0.8, 0.3]}
        position={[0, 0.91, -0.42]}
        color="#e5d6bc"
        radius={0.13}
      />

      {/* Armrests */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[0.25, 0.49, 1.02]}
          position={[side * 0.56, 0.68, 0]}
          color="#e5d6bc"
          radius={0.11}
        />
      ))}

      {/* Orange cushion */}
      <Box
        size={[0.51, 0.47, 0.18]}
        position={[0.1, 0.85, -0.18]}
        rotation={[-0.18, 0, -0.14]}
        color="#c76b37"
        radius={0.07}
      />

      {/* Coffee table */}
      <group position={[-0.3, 0, 1.22]}>
        <Cylinder
          radius={0.29}
          height={0.46}
          position={[0, 0.23, 0]}
          color={darkWood}
        />

        <Cylinder
          radius={0.66}
          height={0.085}
          position={[0, 0.5, 0]}
          color={wood}
        />

        {/* Notebook */}
        <group
          position={[-0.14, 0.565, 0.06]}
          rotation={[0, 0.25, 0]}
        >
          <Box
            size={[0.42, 0.06, 0.54]}
            color="#c96831"
          />

          <Box
            size={[0.38, 0.035, 0.5]}
            position={[0.008, 0, 0]}
            color="#f2e3c6"
          />

          <Box
            size={[0.42, 0.012, 0.54]}
            position={[0, 0.036, 0]}
            color="#d57b3d"
          />

          {/* Pen */}
          <Box
            size={[0.025, 0.025, 0.34]}
            position={[0.08, 0.061, 0]}
            rotation={[0, 0.15, 0]}
            color="#333e3a"
          />
        </group>

        {/* Cup */}
        <Cylinder
          radius={0.09}
          height={0.17}
          position={[0.32, 0.627, -0.12]}
          color="#7b8c72"
        />

        <Cylinder
          radius={0.075}
          height={0.005}
          position={[0.32, 0.715, -0.12]}
          color="#493b2d"
        />
      </group>
    </group>
  );
}

export default function Room() {
  return (
    <group>
      <Shell />

      {/* Rug */}
      <Box
        size={[3.45, 0.025, 2.25]}
        position={[-0.65, 0.038, -0.15]}
        color="#d6c4a5"
        radius={0.012}
      />

      <Desk />
      <Chair />
      <Shelf />
      <Lounge />

      <Plant
        position={[3.25, 0.025, -1.85]}
        scale={1.25}
      />

      <Plant
        position={[-3.35, 0.025, 1.75]}
        scale={0.9}
      />

      {/* Invisible surface receiving the room's shadow */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.32, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.14} />
      </mesh>
    </group>
  );
}