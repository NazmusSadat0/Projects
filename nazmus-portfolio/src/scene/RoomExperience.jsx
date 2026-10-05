import {
  Component,
  Suspense,
  useCallback,
  useRef,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  ACESFilmicToneMapping,
  PCFShadowMap,
} from "three";

import CameraRig, {
  EYE_POSITION,
} from "../scene/CameraRig";

import RoomModel from "../scene/RoomModel";
import RoomFinish from "../scene/RoomFinish";

import RoomLabels, {
  RoomLabelOverlay,
} from "./RoomLabels";

class SceneErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
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
              {this.state.error.message ||
                String(this.state.error)}
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

  const [ready, setReady] = useState(false);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <main
      className={[
        "experience",
        "room-upgrade",
        ready ? "room-ready" : "",
      ].join(" ")}
      aria-label="Drag or swipe to look around the room"
    >
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]}
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
            gl.toneMappingExposure = 0.98;
            gl.shadowMap.type = PCFShadowMap;
          }}
          fallback={
            <div className="fallback">
              This browser cannot display the 3D room.
            </div>
          }
        >
          <color
            attach="background"
            args={["#e4e4dc"]}
          />

          <ambientLight intensity={0.12} />

          <hemisphereLight
            args={["#e5eef1", "#6e5947", 0.55]}
          />

          <directionalLight
            position={[-1.8, 3.65, -1.5]}
            intensity={2.1}
            color="#fff0d8"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
            shadow-camera-near={0.1}
            shadow-camera-far={16}
            shadow-normalBias={0.025}
            shadow-bias={-0.0001}
          />

          <pointLight
            position={[-0.3, 2.8, -2.4]}
            intensity={3}
            distance={9}
            decay={2}
            color="#d8e9f5"
          />

          <pointLight
            position={[2.8, 2.7, 0.6]}
            intensity={1.3}
            distance={7}
            decay={2}
            color="#ffdfb8"
          />

          <Suspense fallback={null}>
            <RoomModel onReady={handleReady} />

            <RoomLabels elements={labelElements} />
          </Suspense>

          <CameraRig ready={ready} />
          <RoomFinish />
        </Canvas>

        <RoomLabelOverlay elements={labelElements} />

        {!ready && (
          <div className="room-loading" role="status">
            Loading room…
          </div>
        )}
      </SceneErrorBoundary>
    </main>
  );
}