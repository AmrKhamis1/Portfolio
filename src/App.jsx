import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import Loader from "./Loader";
import "./CSS/index.css";
import Html from "./Html.jsx";
import Controls from "./Controls.jsx";
import World from "./World.jsx";
import Effects from "./Effects.jsx";
import Projects from "./Projects.jsx";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [freeClicked, setFreeClicked] = useState(false);

  //  positions
  const positions = useMemo(
    () => ({
      free: { x: 0, y: -12, z: 12 },
      initTarget: { x: 0, y: -15, z: 0 },
    }),
    []
  );

  const orbit = useRef(null);

  // free mode handel
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  // camera animations in free mode
  useEffect(() => {
    if (orbit.current && freeClicked) {
      const { free } = positions;
      orbit.current.object.position.set(free.x, free.y, free.z);
      orbit.current.update();
    }
  }, [freeClicked, positions]);

  // camera settings
  const cameraSettings = useMemo(
    () => ({
      position: [positions.free.x, positions.free.y, positions.free.z],
      fov: 80,
    }),
    [positions.free]
  );

  // GL settings
  const glSettings = useMemo(
    () => ({
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.5,
      outputEncoding: THREE.sRGBEncoding,
      shadowMapType: THREE.PCFSoftShadowMap,
      antialias: true,
    }),
    []
  );

  // OrbitControls settings
  const orbitSettings = useMemo(
    () => ({
      enabled: freeClicked,
      enableDamping: freeClicked,
      enableZoom: freeClicked,
      enablePan: false,
      dampingFactor: 0.05,
      minDistance: 10,
      maxDistance: 18,
      minPolarAngle: Math.PI / 2.8,
      maxPolarAngle: Math.PI / 2,
      maxAzimuthAngle: Math.PI / 2,
      minAzimuthAngle: Math.PI * 1.5,
      target: [
        positions.initTarget.x,
        positions.initTarget.y,
        positions.initTarget.z,
      ],
    }),
    [freeClicked, positions.initTarget]
  );

  return (
    <>
      {!loaded && <Loader onLoaded={() => setLoaded(true)} />}
      <Canvas
        dpr={[1, 2]}
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: "0",
          position: "fixed",
          top: "0",
          left: "0",
        }}
        shadows
        gl={glSettings}
        camera={cameraSettings}
      >
        <Perf position="top-left" style={{ zIndex: "1000000000" }} />
        <color attach="background" args={["#000"]} />
        <Effects />
        {!freeClicked && (
          <Controls
            loaded={loaded}
            startClicked={startClicked}
            freeStart={freeClicked}
          />
        )}
        <World
          loaded={loaded}
          startClicked={startClicked}
          freeStart={freeClicked}
        />
        <Projects startClicked={startClicked} />
        <OrbitControls ref={orbit} makeDefault {...orbitSettings} />
      </Canvas>
      <Html
        introFinished={loaded}
        setStartClicked={setStartClicked}
        setFreeClicked={setFreeClicked}
      />
      <div className="contact-footer">
        <div className="contact-icons">
          <a
            href="https://github.com/AmrKhamis1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/amr-khamis-51041622a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="mailto:khamisamr90@gmail.com" aria-label="Email Contact">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </>
  );
}
