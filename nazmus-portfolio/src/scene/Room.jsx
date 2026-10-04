import { Box, Cylinder, Sphere, Plant } from "./Primitives";
import {
  DetailedDeskChair,
  DetailedLounge,
  DetailedLamp,
  DetailedBookshelf,
} from "./DetailedFurniture";
import { getSceneTexture } from "./materialTextures";

const wood = "#aa754d";
const darkWood = "#785136";

function Shell() {
  return (
    <group>
      <Box
        size={[8.2, 0.28, 6.2]}
        position={[0, -0.16, 0]}
        color={darkWood}
      />

      {Array.from({ length: 20 }, (_, col) =>
        Array.from({ length: 4 }, (_, row) => (
          <Box
            key={`${col}-${row}`}
            size={[0.398, 0.035, 1.496]}
            radius={0.003}
            position={[-3.8 + col * 0.4, 0, -2.25 + row * 1.5]}
            color={
              ["#c7986c", "#bd8d60", "#c39468", "#cda277"][
                (col + row * 3) % 4
              ]
            }
          />
        ))
      )}

      <Box size={[8.1, 1.65, 0.16]} position={[0, 0.825, -3]} />
      <Box size={[8.1, 0.25, 0.16]} position={[0, 3.275, -3]} />
      <Box size={[1.8, 1.5, 0.16]} position={[-3.15, 2.4, -3]} />
      <Box size={[2.4, 1.5, 0.16]} position={[2.85, 2.4, -3]} />

      <Box
        size={[0.16, 2.8, 6]}
        position={[-4, 1.4, 0]}
        color="#e4dac7"
      />

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

      <Box
        size={[4.02, 1.61, 0.2]}
        position={[-0.3, 2.4, -3.04]}
        color={darkWood}
      />

      <mesh position={[-0.3, 2.4, -2.929]}>
        <planeGeometry args={[3.8, 1.38]} />
        <meshBasicMaterial
          map={getSceneTexture("window")}
          toneMapped={false}
        />
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
      <Box
        size={[0.58, 0.035, 0.37]}
        position={[0, 0.027, 0.06]}
        color="#343632"
      />
      <Box
        size={[0.09, 0.37, 0.1]}
        position={[0, 0.21, 0]}
        color="#343632"
      />
      <Box
        size={[1.85, 1.03, 0.065]}
        position={[0, 0.79, 0]}
        color="#252b2b"
        radius={0.022}
      />

      <mesh position={[0, 0.79, 0.037]}>
        <planeGeometry args={[1.77, 0.945]} />
        <meshBasicMaterial
          map={getSceneTexture("screen")}
          toneMapped={false}
        />
      </mesh>

      <Box
        size={[1.13, 0.045, 0.39]}
        position={[0, 0.035, 0.67]}
        color="#d7d3c5"
      />

      {Array.from({ length: 48 }, (_, index) => (
        <Box
          key={index}
          size={[0.072, 0.013, 0.062]}
          position={[
            -0.49 + (index % 12) * 0.089,
            0.064,
            0.535 + Math.floor(index / 12) * 0.087,
          ]}
          color={index === 0 ? "#b68a62" : "#eee9da"}
          radius={0.005}
        />
      ))}

      <Sphere
        position={[0.89, 0.055, 0.64]}
        scale={[0.1, 0.05, 0.16]}
        color="#eee9dc"
      />
      <Box
        size={[0.011, 0.005, 0.047]}
        position={[0.89, 0.103, 0.59]}
        color="#92988c"
        radius={0.002}
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
          <Sphere
            position={[side * 0.07, 0.44, 0.145]}
            scale={[0.027, 0.04, 0.014]}
            color="#8de3e6"
          />
          <Sphere
            position={[side * 0.11, 0.038, 0.065]}
            scale={[0.085, 0.045, 0.12]}
          />
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
      <Box
        size={[5.15, 0.14, 1.3]}
        position={[0.05, 1.37, -2.02]}
        color={wood}
        radius={0.045}
      />
      <Box
        size={[5.05, 0.035, 1.22]}
        position={[0.05, 1.292, -2.02]}
        color={darkWood}
      />
      <Box
        size={[0.15, 1.3, 1.15]}
        position={[-2.43, 0.65, -2.02]}
        color={darkWood}
      />
      <Box
        size={[3.95, 0.35, 0.07]}
        position={[-0.37, 1.04, -2.57]}
        color={darkWood}
      />
      <Box
        size={[1.02, 1.25, 1.15]}
        position={[2.05, 0.63, -2.02]}
        color="#747765"
      />

      {[0.23, 0.64, 1.05].map((y) => (
        <group key={y}>
          <Box
            size={[0.94, 0.374, 0.045]}
            position={[2.05, y, -1.419]}
            color="#878975"
            radius={0.013}
          />

          {[-1, 1].map((side) => (
            <Box
              key={side}
              size={[0.022, 0.025, 0.043]}
              position={[2.05 + side * 0.145, y + 0.08, -1.378]}
              color="#4d5146"
            />
          ))}

          <Box
            size={[0.32, 0.025, 0.022]}
            position={[2.05, y + 0.08, -1.355]}
            color="#4d5146"
          />
        </group>
      ))}

      <Box
        size={[2.15, 0.008, 0.56]}
        position={[0.02, 1.448, -1.55]}
        color="#697262"
        surface="fabric"
        radius={0.002}
      />

      <Computer />
      <Robot />
      <DetailedLamp />

      <group position={[2, 1.45, -2.04]}>
        <Box
          size={[0.33, 0.035, 0.3]}
          position={[0, 0.018, 0]}
          color={darkWood}
        />
        <Box
          size={[0.2, 0.21, 0.035]}
          position={[0, 0.13, -0.045]}
          rotation={[-0.2, 0, 0]}
          color={wood}
        />

        <group
          position={[0, 0.285, 0.008]}
          rotation={[-0.14, -0.12, 0]}
        >
          <Box
            size={[0.25, 0.48, 0.035]}
            color="#252c2e"
            radius={0.011}
          />
          <Box
            size={[0.221, 0.443, 0.006]}
            position={[0, 0, 0.021]}
            color="#a9c4c5"
          />
          <Box
            size={[0.074, 0.015, 0.005]}
            position={[0, 0.197, 0.026]}
            color="#252c2e"
          />
        </group>
      </group>

      <Plant position={[-1.25, 1.45, -2.35]} scale={0.4} />
    </group>
  );
}

export default function Room() {
  return (
    <group>
      <Shell />

      <Box
        size={[3.45, 0.025, 2.25]}
        position={[-0.65, 0.038, -0.15]}
        color="#d6c4a5"
        surface="fabric"
        radius={0.012}
      />

      <Desk />
      <DetailedDeskChair />
      <DetailedBookshelf />
      <DetailedLounge />

      <Plant position={[3.25, 0.025, -1.85]} scale={1.25} />
      <Plant position={[-3.35, 0.025, 1.75]} scale={0.9} />
    </group>
  );
}