import { Component, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
} from "three";

import CameraRig, {
  EYE_POSITION,
} from "../scene/CameraRig";

import RoomModel from "../scene/RoomModel";
import RoomLabels, { RoomLabelOverlay } from "./RoomLabels";
import RoomFinish from "../scene/RoomFinish";

class SceneErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  componentDidCatch(error) {
    console.error("Unable to load the room:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fallback" role="alert">
          <div>
            <p>The room could not load.</p>

            <p>
              {this.state.error.message || String(this.state.error)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function RoomExperience() {
  const labelElements = useRef([]);

  return (
    <main
      className="experience"
      aria-label="Drag or swipe to look around the room"
    >
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: EYE_POSITION,
            fov: 50,
            near: 0.04,
            far: 40,
          }}
          gl={{
            antialias: true,
            alpha: false,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.type = PCFSoftShadowMap;
          }}
          fallback={
            <div className="fallback">
              This browser cannot display the 3D room.
            </div>
          }
        >
          <color
            attach="background"
            args={["#eee6d8"]}
          />

          <ambientLight intensity={0.22} />

          <hemisphereLight
            args={["#fff1db", "#8b7760", 0.7]}
          />

          <directionalLight
            position={[1.4, 3.8, 1.7]}
            intensity={1.8}
            color="#ffe5c1"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-camera-near={0.1}
            shadow-camera-far={18}
            shadow-normalBias={0.02}
            shadow-bias={-0.0001}
          />

          <pointLight
            position={[-0.3, 2.8, -2.45]}
            intensity={3}
            distance={9}
            decay={2}
            color="#d4e5ec"
          />

          <pointLight
            position={[2.8, 2.7, 0.6]}
            intensity={2}
            distance={7}
            decay={2}
            color="#ffe4bf"
          />

          <Suspense fallback={null}>
            <RoomModel />
            <RoomLabels elements={labelElements} />
          </Suspense>

          <CameraRig />
          <RoomFinish />
        </Canvas>
        <RoomLabelOverlay elements={labelElements} />
      </SceneErrorBoundary>
    </main>
  );
}
