import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  const [startClicked, setStartClicked] = useState(false); // New state to track if start button is clicked
  const orbitRef = useRef(null);
  useEffect(() => {
    document.body.style.overflow = "auto"; // Ensure scrolling is enabled
  }, []);
  // setInterval(() => {
  //   if (orbitRef.current) {
  //     console.log("position: ", orbitRef.current.object.position);
  //     console.log("target: ", orbitRef.current.target);
  //   }
  // }, 500);

  return (
    <>
      {!loaded && <Loader onLoaded={() => setLoaded(true)} />}
      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: "0",
          position: "fixed",
          pointerEvents: "none",
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
        camera={{ fov: 45 }}
        // orthographic
      >
        {/* <OrbitControls ref={orbitRef}></OrbitControls> */}
        {/* <fog attach="fog" args={["#211142", 0, 70]} /> */}
        {/* <Perf position="top-left" /> */}
        {/* <color attach="background" args={["#211142"]} /> */}
        <Effects></Effects>
        <Controls loaded={loaded} startClicked={startClicked}></Controls>
        <World loaded={loaded} startClicked={startClicked}></World>
        <Projects startClicked={startClicked}></Projects>
      </Canvas>
      <Html introFinished={loaded} setStartClicked={setStartClicked} />
    </>
  );
}
