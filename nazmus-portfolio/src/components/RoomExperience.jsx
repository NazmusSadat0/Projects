import { Component, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import CameraRig, {
  INITIAL_ANGLE,
  clampAngle,
} from "../scene/CameraRig";

import Room from "../scene/Room";

class SceneErrorBoundary extends Component {
  state = {
    error: false,
  };

  static getDerivedStateFromError() {
    return {
      error: true,
    };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fallback" role="alert">
          The 3D room could not start. Try enabling browser
          hardware acceleration and reload.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function RoomExperience() {
  const angle = useRef(INITIAL_ANGLE);

  function rotate(direction) {
    angle.current = clampAngle(
      angle.current + direction * 0.15
    );
  }

  function handleKeyDown(event) {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();

      rotate(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <main
      className="experience"
      aria-label="Nazmus's interactive room"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <SceneErrorBoundary>
        <Canvas
          orthographic
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [7, 10, 12],
            zoom: 70,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
          }}
          fallback={
            <div className="fallback">
              This browser cannot display the 3D room.
            </div>
          }
        >
          <color
            attach="background"
            args={["#f4ecdf"]}
          />

          <ambientLight intensity={0.65} />

          <hemisphereLight
            args={["#fff6e7", "#8b7964", 1.7]}
          />

          {/* Main warm light */}
          <directionalLight
            position={[2, 9, 6]}
            intensity={3.1}
            color="#fff0d5"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-normalBias={0.035}
          />

          {/* Cooler fill light */}
          <directionalLight
            position={[-3, 5, -2]}
            intensity={0.7}
            color="#c6e0ec"
          />

          <Room />
          <CameraRig angle={angle} />
        </Canvas>
      </SceneErrorBoundary>

      <nav
        className="rotation-controls"
        aria-label="Room rotation"
      >
        <button
          type="button"
          onClick={() => rotate(-1)}
          aria-label="Rotate view left"
          title="Rotate left"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </button>

        <span
          className="control-divider"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => rotate(1)}
          aria-label="Rotate view right"
          title="Rotate right"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 6l6 6-6 6" />
          </svg>
        </button>
      </nav>
    </main>
  );
}