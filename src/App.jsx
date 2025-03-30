import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";
import { Perf } from "r3f-perf";
import Loader from "./Loader";
import "./CSS/index.css";
import Html from "./Html.jsx";
import Controls from "./Controls.jsx";
import "./CSS/index.css";
import World from "./World.jsx";
import Effects from "./Effects.jsx";
import Projects from "./Projects.jsx";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false); // State to control word shape

  useEffect(() => {
    document.body.style.overflow = "auto"; // Ensure scrolling is enabled
  }, []);
  return (
    <>
      {!loaded && <Loader onLoaded={() => setLoaded(true)} />}
      <Html setHoverEffect={setHoverEffect} introFinished={loaded} />

      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: "-10",
          position: "fixed",
          top: "0",
          left: "0",
        }}
        shadows
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          outputEncoding: THREE.sRGBEncoding,
          // shadowMap: "enable",
          shadowMapType: THREE.PCFSoftShadowMap,
          antialias: true,
        }}
        camera={{ position: [0, 250, 60], fov: 120 }}
        // orthographic
      >
        {/* {loaded && (
          <PositionalAudio
            autoplay
            loop
            url="./sounds/sound.mp3"
            distance={3}
          />
        )} */}
        {/* <OrbitControls></OrbitControls> */}
        <fog attach="fog" args={["#080814", 0, 60]} />
        <Perf position="top-left" />
        <color attach="background" args={["#080814"]} />
        <Effects></Effects>
        <Controls loaded={loaded}></Controls>
        <World loaded={loaded}></World>
        {/* <Projects></Projects> */}
      </Canvas>
    </>
  );
}
