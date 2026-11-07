import {
  Component,
  Suspense,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
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
import RoomInteractions from "../scene/RoomInteractions";

import RoomLabels, {
  RoomLabelOverlay,
} from "./RoomLabels";

import RoomSections from "../components/RoomSections.jsx";
import RoomPreloader from "../components/RoomPreLoader.jsx";

const MOBILE_QUERY = "(width < 700px)";

function subscribeToScreenWidth(onChange) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isMobileScreen() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function desktopScreenSnapshot() {
  return false;
}

class SceneErrorBoundary extends Component {
  state = { error: null };

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
  const mobileScreen = useSyncExternalStore(
    subscribeToScreenWidth,
    isMobileScreen,
    desktopScreenSnapshot,
  );

  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [section, setSection] = useState(null);
  const [interacted, setInteracted] = useState(false);

  const handleInteract = useCallback(() => {
    setInteracted(true);
  }, []);

  const nudgeLeft = () => {
    handleInteract();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowLeft" }));
    }, 180);
  };

  const nudgeRight = () => {
    handleInteract();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight" }));
    }, 180);
  };

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  const closeSection = useCallback(() => {
    setSection(null);
  }, []);

  return (
    <main
      className={[
        "experience",
        "room-upgrade",
        ready ? "room-ready" : "",
        hovered ? "has-room-target" : "",
      ].join(" ")}
      aria-label="Portfolio room"
    >
      <SceneErrorBoundary>
        <Canvas
          shadows
          dpr={mobileScreen ? 1 : [1, 1.35]}
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
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
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
            <RoomInteractions
              ready={ready}
              hovered={hovered}
              onHover={setHovered}
              onOpen={setSection}
            >
              <RoomModel onReady={handleReady} />
            </RoomInteractions>

            <RoomLabels elements={labelElements} />
          </Suspense>

          <CameraRig
            ready={ready}
            section={section}
            onInteract={handleInteract}
          />
          <RoomFinish />
        </Canvas>

        <RoomLabelOverlay
          elements={labelElements}
          hovered={hovered}
          hidden={Boolean(section)}
          onOpen={setSection}
          onHover={setHovered}
        />

        {/* Visible screen-edge navigation buttons */}
        <button
          type="button"
          className="room-nav-arrow room-nav-arrow--left"
          onClick={nudgeLeft}
          aria-label="Rotate view left"
        >
          ‹
        </button>

        <button
          type="button"
          className="room-nav-arrow room-nav-arrow--right"
          onClick={nudgeRight}
          aria-label="Rotate view right"
        >
          ›
        </button>

            

        <div
          className={[
            "room-guide",
            ready && !interacted && !section ? "room-guide--visible" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <div className="room-guide-icon">
            <svg viewBox="0 0 64 28" fill="none">
              <path
                d="M14 14H4M4 14L9 9M4 14L9 19M50 14H60M60 14L55 9M60 14L55 19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                className="room-guide-dot"
                cx="32"
                cy="14"
                r="5"
                fill="currentColor"
              />
            </svg>
          </div>

          <span className="room-guide-text">
            Drag or press <kbd>←</kbd> <kbd>→</kbd> to look around · Click markers to explore
          </span>
        </div>

        {section && (
          <RoomSections
            section={section}
            onClose={closeSection}
          />
        )}

        {/* Appears only when reached using keyboard focus. */}
        <nav
          className="room-keyboard-nav"
          aria-label="Portfolio sections"
        >
          {["projects", "about", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => setSection(id)}
            >
              {id === "about" ? "About me" : id}
            </button>
          ))}
        </nav>

        <RoomPreloader ready={ready} />
      </SceneErrorBoundary>
    </main>
  );
}
