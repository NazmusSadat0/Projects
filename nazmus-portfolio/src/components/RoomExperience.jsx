import { Component } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
} from "three";

import CameraRig, {
  EYE_POSITION,
} from "../scene/CameraRig";

import Room from "../scene/Room";
import RoomDetails from "../scene/RoomDetails";
import InteriorShell from "../scene/InteriorShell";

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
          The room could not start. Please reload the page
          and check the browser console for the error.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function RoomExperience() {
  return (
    <main
      className="experience"
      aria-label="Inside Nazmus's room. Drag or swipe horizontally to look left and right."
    >
      <SceneErrorBoundary>
        <Canvas
          key="interior-perspective-view"
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: EYE_POSITION,
            rotation: [-0.12, 0, 0],
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
            gl.toneMappingExposure = 1;
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

          {/* General bounced-light approximation */}
          <ambientLight intensity={0.45} />

          <hemisphereLight
            args={["#fff1db", "#8b7760", 1.15]}
          />

          {/* Main light positioned inside the enclosed room */}
          <directionalLight
            position={[1.4, 3.15, 1.7]}
            intensity={2.2}
            color="#ffe5c1"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-camera-near={0.1}
            shadow-camera-far={18}
            shadow-normalBias={0.025}
            shadow-bias={-0.0001}
          />

          {/* Cooler light around the window */}
          <pointLight
            position={[-0.3, 2.8, -2.45]}
            intensity={3}
            distance={9}
            decay={2}
            color="#d4e5ec"
          />

          {/* Gentle warm fill near the lounge */}
          <pointLight
            position={[2.8, 2.7, 0.6]}
            intensity={2}
            distance={7}
            decay={2}
            color="#ffe4bf"
          />

          <Room />
          <RoomDetails />
          <InteriorShell />
          <CameraRig />
        </Canvas>
      </SceneErrorBoundary>
    </main>
  );
}