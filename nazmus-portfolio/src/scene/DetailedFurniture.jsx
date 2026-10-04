import { useMemo } from "react";

import {
  CatmullRomCurve3,
  DoubleSide,
  Quaternion,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";

import {
  Box,
  Cylinder,
  Plant,
  Sphere,
} from "./Primitives";

import { getMaterialTextures } from "./materialTextures";

const WOOD = "#aa754d";
const DARK_WOOD = "#785136";
const METAL = "#444a43";

/*
 * A cylinder connecting any two points.
 * Used for legs, supports, and lamp arms.
 */
function Rod({
  from,
  to,
  radius = 0.025,
  color = METAL,
  metalness = 0.4,
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);

    const direction = end.clone().sub(start);
    const length = direction.length();

    return {
      position: start.clone().add(end).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        direction.normalize()
      ),
      length,
    };
  }, [from, to]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[radius, radius, length, 12]}
      />

      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={0.48}
      />
    </mesh>
  );
}

/*
 * A softly inflated cushion.
 * Unlike a plain rounded box, all of its surfaces bulge.
 */
function Cushion({
  size,
  color = "#e5d6bc",
  softness = 0.38,
  ...props
}) {
  const [width, height, depth] = size;

  const geometry = useMemo(() => {
    const result = new SphereGeometry(1, 40, 24);
    const positions = result.attributes.position;

    const inflate = (value) =>
      Math.sign(value) *
      Math.pow(Math.abs(value), softness);

    for (let i = 0; i < positions.count; i++) {
      positions.setXYZ(
        i,
        inflate(positions.getX(i)) * width * 0.5,
        inflate(positions.getY(i)) * height * 0.5,
        inflate(positions.getZ(i)) * depth * 0.5
      );
    }

    positions.needsUpdate = true;
    result.computeVertexNormals();

    return result;
  }, [width, height, depth, softness]);

  const textures = useMemo(
    () => getMaterialTextures("fabric"),
    []
  );

  return (
    <mesh
      {...props}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        map={textures.color}
        bumpMap={textures.bump}
        bumpScale={0.009}
        roughness={0.98}
      />
    </mesh>
  );
}

/*
 * A stitched/piped rounded rectangle.
 * It lies in the XY plane; rotate it for a horizontal cushion.
 */
function Piping({
  width,
  height,
  radius = 0.08,
  color = "#c4b59a",
  thickness = 0.007,
  ...props
}) {
  const curve = useMemo(() => {
    const r = Math.min(radius, width / 3, height / 3);
    const points = [];

    const corners = [
      [width / 2 - r, height / 2 - r, 0],
      [-width / 2 + r, height / 2 - r, Math.PI / 2],
      [-width / 2 + r, -height / 2 + r, Math.PI],
      [width / 2 - r, -height / 2 + r, Math.PI * 1.5],
    ];

    for (const [x, y, startAngle] of corners) {
      for (let step = 0; step <= 8; step++) {
        const angle =
          startAngle + (step / 8) * (Math.PI / 2);

        points.push(
          new Vector3(
            x + Math.cos(angle) * r,
            y + Math.sin(angle) * r,
            0
          )
        );
      }
    }

    return new CatmullRomCurve3(
      points,
      true,
      "centripetal"
    );
  }, [width, height, radius]);

  return (
    <mesh {...props}>
      <tubeGeometry
        args={[curve, 80, thickness, 6, true]}
      />

      <meshStandardMaterial
        color={color}
        roughness={0.95}
      />
    </mesh>
  );
}

function TurnedVase({ position, scale = 1 }) {
  const points = useMemo(
    () =>
      [
        [0.07, 0],
        [0.13, 0.025],
        [0.17, 0.12],
        [0.15, 0.23],
        [0.085, 0.3],
        [0.07, 0.36],
        [0.052, 0.36],
        [0.06, 0.3],
        [0.12, 0.22],
        [0.13, 0.12],
        [0.09, 0.04],
      ].map(([x, y]) => new Vector2(x, y)),
    []
  );

  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <latheGeometry args={[points, 40]} />

      <meshStandardMaterial
        color="#cbb798"
        roughness={0.72}
        side={DoubleSide}
      />
    </mesh>
  );
}

export function DetailedDeskChair() {
  return (
    <group
      position={[-0.75, 0, -0.45]}
      rotation={[0, -0.36, 0]}
    >
      {/* Five-spoke base and caster wheels */}
      {Array.from({ length: 5 }, (_, i) => (
        <group
          key={i}
          rotation={[0, (i * Math.PI * 2) / 5, 0]}
        >
          <Rod
            from={[0, 0.19, 0]}
            to={[0, 0.12, 0.49]}
            radius={0.033}
          />

          <group position={[0, 0.087, 0.49]}>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.042, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
              >
                <cylinderGeometry
                  args={[0.073, 0.073, 0.045, 20]}
                />

                <meshStandardMaterial
                  color="#30352f"
                  roughness={0.86}
                />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Gas lift */}
      <Cylinder
        radius={0.055}
        height={0.37}
        position={[0, 0.35, 0]}
        color="#444b43"
      />

      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry
          args={[0.031, 0.031, 0.25, 20]}
        />
        <meshStandardMaterial
          color="#b1b6af"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      {/* Wooden seat shell */}
      <Box
        size={[0.9, 0.095, 0.82]}
        position={[0, 0.69, 0]}
        color={DARK_WOOD}
        radius={0.035}
      />

      {/* Padded seat */}
      <Cushion
        size={[0.88, 0.2, 0.81]}
        position={[0, 0.79, -0.015]}
        color="#8a9279"
      />

      <Piping
        width={0.83}
        height={0.75}
        position={[0, 0.78, -0.015]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#727c63"
      />

      {/* Back support */}
      <Rod
        from={[0, 0.64, 0.3]}
        to={[0, 1.13, 0.45]}
        radius={0.038}
      />

      {/* Backrest assembly */}
      <group
        position={[0, 1.22, 0.35]}
        rotation={[0.13, 0, 0]}
      >
        <Box
          size={[0.89, 0.81, 0.12]}
          color={WOOD}
          radius={0.04}
        />

        <Cushion
          size={[0.81, 0.73, 0.17]}
          position={[0, 0, -0.092]}
          color="#8a9279"
        />

        <Piping
          width={0.77}
          height={0.69}
          position={[0, 0, -0.14]}
          color="#727c63"
        />
      </group>

      {/* Arm supports and wooden armrests */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Rod
            from={[side * 0.39, 0.66, 0.17]}
            to={[side * 0.51, 1.04, 0.17]}
            radius={0.021}
          />

          <Box
            size={[0.14, 0.065, 0.57]}
            position={[side * 0.51, 1.05, -0.01]}
            color={WOOD}
            radius={0.025}
          />
        </group>
      ))}
    </group>
  );
}

function CoffeeCup() {
  const profile = useMemo(
    () =>
      [
        [0.058, 0],
        [0.078, 0.014],
        [0.087, 0.14],
        [0.083, 0.17],
        [0.07, 0.17],
        [0.067, 0.035],
        [0.058, 0.025],
      ].map(([x, y]) => new Vector2(x, y)),
    []
  );

  return (
    <group position={[0.3, 0.545, -0.16]}>
      {/* Hollow ceramic cup */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 40]} />
        <meshStandardMaterial
          color="#819078"
          roughness={0.42}
          side={DoubleSide}
        />
      </mesh>

      {/* Coffee surface */}
      <mesh
        position={[0, 0.145, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.068, 32]} />
        <meshStandardMaterial
          color="#443024"
          roughness={0.26}
        />
      </mesh>

      {/* Handle */}
      <mesh position={[0.092, 0.092, 0]} castShadow>
        <torusGeometry args={[0.049, 0.013, 10, 28]} />
        <meshStandardMaterial
          color="#819078"
          roughness={0.42}
        />
      </mesh>
    </group>
  );
}

function DetailedNotebook() {
  return (
    <group
      position={[-0.16, 0.571, 0.08]}
      rotation={[0, 0.25, 0]}
    >
      {/* Back cover */}
      <Box
        size={[0.43, 0.015, 0.55]}
        position={[0, -0.023, 0]}
        color="#a9562b"
        radius={0.006}
      />

      {/* Individual page layers */}
      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={i}
          size={[0.398, 0.004, 0.52]}
          position={[0.007, -0.012 + i * 0.005, 0]}
          color={i % 2 ? "#e5d8bd" : "#f0e5cf"}
          radius={0.002}
        />
      ))}

      {/* Front cover */}
      <Box
        size={[0.43, 0.015, 0.55]}
        position={[0, 0.026, 0]}
        color="#cb773c"
        radius={0.006}
      />

      {/* Spine */}
      <Box
        size={[0.025, 0.064, 0.55]}
        position={[-0.205, 0.002, 0]}
        color="#ae5c2f"
        radius={0.008}
      />

      {/* Elastic band */}
      <Box
        size={[0.016, 0.008, 0.55]}
        position={[0.14, 0.038, 0]}
        color="#87502e"
        radius={0.003}
      />

      {/* Pen */}
      <group
        position={[-0.02, 0.049, 0]}
        rotation={[Math.PI / 2, 0, 0.15]}
      >
        <Cylinder
          radius={0.009}
          height={0.34}
          color="#334039"
        />

        <Cylinder
          radius={0.011}
          height={0.08}
          position={[0, 0.12, 0]}
          color="#b9a878"
        />
      </group>

      {/* Ribbon bookmark */}
      <Box
        size={[0.027, 0.003, 0.11]}
        position={[-0.08, -0.007, 0.3]}
        color="#b45530"
        radius={0.001}
      />
    </group>
  );
}

export function DetailedLounge() {
  return (
    <group
      position={[2.6, 0, 0.65]}
      rotation={[0, -0.28, 0]}
    >
      {/* Angled wooden legs */}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Rod
            key={`${x}-${z}`}
            from={[x * 0.43, 0.05, z * 0.38]}
            to={[x * 0.37, 0.37, z * 0.31]}
            radius={0.039}
            color={DARK_WOOD}
            metalness={0}
          />
        ))
      )}

      {/* Lower upholstered base */}
      <Cushion
        size={[1.2, 0.26, 1.08]}
        position={[0, 0.39, 0]}
        color="#d8c9ae"
      />

      {/* Separate seat cushion */}
      <Cushion
        size={[0.94, 0.22, 0.87]}
        position={[0, 0.57, 0.06]}
        color="#e5d6bc"
      />

      <Piping
        width={0.87}
        height={0.8}
        position={[0, 0.565, 0.06]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#c3b294"
        thickness={0.006}
      />

      {/* Soft backrest */}
      <group
        position={[0, 0.96, -0.39]}
        rotation={[-0.12, 0, 0]}
      >
        <Cushion
          size={[1.14, 0.91, 0.33]}
          color="#e5d6bc"
        />

        <Piping
          width={1.05}
          height={0.8}
          position={[0, 0, 0.14]}
          color="#c9b99b"
        />
      </group>

      {/* Rounded arm cushions */}
      {[-1, 1].map((side) => (
        <Cushion
          key={side}
          size={[0.29, 0.53, 1.05]}
          position={[side * 0.57, 0.72, 0]}
          rotation={[0, 0, side * -0.08]}
          color="#e0d0b5"
          softness={0.52}
        />
      ))}

      {/* Throw pillow */}
      <group
        position={[0.13, 0.91, -0.12]}
        rotation={[-0.19, 0.12, -0.16]}
      >
        <Cushion
          size={[0.51, 0.49, 0.18]}
          color="#c87942"
          softness={0.46}
        />

        <Piping
          width={0.44}
          height={0.42}
          position={[0, 0, 0.075]}
          color="#a85f33"
          thickness={0.004}
        />
      </group>

      {/* Coffee table */}
      <group position={[-0.3, 0, 1.22]}>
        <Cylinder
          radius={0.255}
          height={0.46}
          position={[0, 0.25, 0]}
          color={DARK_WOOD}
        />

        {/* Fluted wooden pedestal */}
        {Array.from({ length: 28 }, (_, i) => {
          const angle = (i / 28) * Math.PI * 2;

          return (
            <Cylinder
              key={i}
              radius={0.017}
              height={0.44}
              position={[
                Math.sin(angle) * 0.26,
                0.25,
                Math.cos(angle) * 0.26,
              ]}
              color={i % 2 ? WOOD : DARK_WOOD}
            />
          );
        })}

        {/* Beveled rim under the tabletop */}
        <Cylinder
          radius={0.64}
          top={0.66}
          height={0.035}
          position={[0, 0.472, 0]}
          color={DARK_WOOD}
        />

        <Cylinder
          radius={0.66}
          height={0.075}
          position={[0, 0.51, 0]}
          color={WOOD}
        />

        <DetailedNotebook />
        <CoffeeCup />
      </group>
    </group>
  );
}

export function DetailedLamp() {
  return (
    <group position={[-1.95, 1.44, -2.12]}>
      {/* Weighted base */}
      <Cylinder
        radius={0.22}
        top={0.19}
        height={0.055}
        position={[0, 0.028, 0]}
        color="#bc6635"
      />

      <Cylinder
        radius={0.155}
        height={0.025}
        position={[0, 0.066, 0]}
        color="#d37b41"
      />

      {/* Articulated arms */}
      <Rod
        from={[0, 0.08, 0]}
        to={[-0.16, 0.55, -0.03]}
        radius={0.023}
        color="#ad5e32"
      />

      <Rod
        from={[-0.16, 0.55, -0.03]}
        to={[0.17, 0.94, 0]}
        radius={0.023}
        color="#ad5e32"
      />

      {/* Secondary support rod */}
      <Rod
        from={[-0.09, 0.1, 0]}
        to={[-0.24, 0.51, -0.03]}
        radius={0.009}
        color="#956143"
      />

      {/* Pivot joints */}
      {[
        [0, 0.09, 0],
        [-0.16, 0.55, -0.03],
        [0.17, 0.94, 0],
      ].map((position, i) => (
        <mesh
          key={i}
          position={position}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.047, 0.047, 0.07, 24]} />

          <meshStandardMaterial
            color="#c47642"
            metalness={0.35}
            roughness={0.43}
          />
        </mesh>
      ))}

      {/* Open shade */}
      <group
        position={[0.24, 0.89, 0.04]}
        rotation={[0.1, 0, 0.3]}
      >
        <mesh castShadow>
          <cylinderGeometry
            args={[0.075, 0.205, 0.22, 40, 1, true]}
          />

          <meshStandardMaterial
            color="#cc773c"
            metalness={0.22}
            roughness={0.38}
            side={DoubleSide}
          />
        </mesh>

        {/* Warm underside */}
        <mesh
          position={[0, -0.101, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.183, 40]} />

          <meshStandardMaterial
            color="#ffe4b0"
            emissive="#ffc16f"
            emissiveIntensity={0.65}
            side={DoubleSide}
          />
        </mesh>
      </group>

      <pointLight
        position={[0.24, 0.73, 0.08]}
        color="#ffd19a"
        intensity={1.7}
        distance={2.8}
        decay={2}
      />
    </group>
  );
}

function StandingBook({ position, height, color }) {
  return (
    <group position={position}>
      {/* Pages */}
      <Box
        size={[0.48, height - 0.025, 0.073]}
        position={[0, height / 2, 0]}
        color="#e5dbc5"
        radius={0.003}
      />

      {/* Covers */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[0.52, height, 0.009]}
          position={[0, height / 2, side * 0.044]}
          color={color}
          radius={0.003}
        />
      ))}

      {/* Spine faces into the room */}
      <Box
        size={[0.018, height, 0.098]}
        position={[0.252, height / 2, 0]}
        color={color}
        radius={0.005}
      />

      {/* Decorative spine bands */}
      {[0.065, height - 0.065].map((y) => (
        <Box
          key={y}
          size={[0.006, 0.011, 0.078]}
          position={[0.264, y, 0]}
          color="#d7c39a"
          radius={0.001}
        />
      ))}
    </group>
  );
}

export function DetailedBookshelf() {
  const bookColors = [
    "#728372",
    "#b87e53",
    "#d0b98f",
    "#626f68",
    "#a29b83",
  ];

  return (
    <group position={[-3.5, 0, -0.72]}>
      {/* Recessed back panel */}
      <Box
        size={[0.04, 1.3, 3.54]}
        position={[-0.34, 0.76, 0]}
        color={DARK_WOOD}
      />

      {/* Shelves */}
      {[0.15, 0.75, 1.4].map((y) => (
        <Box
          key={y}
          size={[0.78, 0.085, 3.6]}
          position={[0, y, 0]}
          color={WOOD}
          radius={0.016}
        />
      ))}

      {/* Dividers */}
      {[-1.75, -0.55, 0.6, 1.75].map((z) => (
        <Box
          key={z}
          size={[0.75, 1.3, 0.065]}
          position={[0, 0.76, z]}
          color={WOOD}
          radius={0.012}
        />
      ))}

      {/* Books arranged within separate cubbies */}
      {[-1.57, -0.35, 0.77].map((start, section) =>
        Array.from({ length: section === 1 ? 5 : 6 }, (_, i) => (
          <StandingBook
            key={`${section}-${i}`}
            position={[0.045, 0.797, start + i * 0.14]}
            height={0.36 + ((i + section) % 3) * 0.055}
            color={bookColors[(i + section) % bookColors.length]}
          />
        ))
      )}

      {/* Lower book stack */}
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          size={[0.54, 0.075, 0.62 - (i % 2) * 0.06]}
          position={[0.045, 0.235 + i * 0.079, -1.13]}
          color={bookColors[i]}
          radius={0.005}
        />
      ))}

      {/* Fabric storage box */}
      <Box
        size={[0.55, 0.35, 0.69]}
        position={[0.04, 0.373, 1.12]}
        color="#c6b89c"
        surface="fabric"
        radius={0.025}
      />

      <Box
        size={[0.008, 0.052, 0.17]}
        position={[0.32, 0.4, 1.12]}
        color="#756e5d"
        radius={0.004}
      />

      <TurnedVase position={[0.05, 0.2, 0.03]} scale={1.1} />

      {/* Top surface decorations */}
      <Plant position={[0, 1.45, -1.25]} scale={0.6} />

      <TurnedVase position={[0, 1.445, 0.75]} scale={0.85} />

      <Box
        size={[0.48, 0.055, 0.39]}
        position={[0, 1.475, -0.23]}
        color="#76816d"
        radius={0.006}
      />

      <Box
        size={[0.43, 0.05, 0.34]}
        position={[0.02, 1.529, -0.23]}
        color="#c2a276"
        radius={0.006}
      />

      {/* Small sculptural object */}
      <Sphere
        position={[0, 1.64, -0.23]}
        scale={[0.075, 0.09, 0.075]}
        color="#ded0b5"
      />
    </group>
  );
}