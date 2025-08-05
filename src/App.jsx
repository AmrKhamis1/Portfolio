import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import gsap from "gsap";
import Loader from "./Loader";
import "./CSS/index.css";
import Html from "./Html.jsx";
import Controls from "./Controls.jsx";
import World from "./World.jsx";
import World2 from "./World2.jsx";
import Effects from "./Effects.jsx";
import Projects from "./Projects.jsx";
import CameraControls from "./CameraControls.jsx";
import VisitorCounter from "./helpers/VC";
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [freeClicked, setFreeClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentView, setCurrentView] = useState("reset");
  const [clicksLocked, setClicksLocked] = useState(false);
  const [showWorld2, setShowWorld2] = useState(false);
  const [isGateTransition, setIsGateTransition] = useState(false);

  const cameraControlsRef = useRef(null);
  const effectsRef = useRef(null);

  const cameraPositions = useMemo(
    () => ({
      free: { x: 0, y: -12, z: 12 },
      initTarget: { x: 0, y: -15, z: 0 },
      project1: {
        position: { x: -5.8, y: -12.8, z: 0.4 },
        target: { x: -4.7, y: -15.0, z: 0.07 },
        orbitSettings: {
          enableDamping: false,
          enableZoom: false,
          enablePan: false,
          enableRotate: false,
          dampingFactor: 0.05,
        },
      },
      project2: {
        position: { x: 5.9, y: -13.89, z: 1.0 },
        target: { x: 5.82, y: -13.69, z: -2.99 },
        orbitSettings: {
          enableDamping: false,
          enableZoom: false,
          enablePan: false,
          enableRotate: false,
          dampingFactor: 0.05,
        },
      },
      project3: {
        position: { x: 0, y: -12, z: 12 },
        target: { x: 0, y: -15, z: 0 },
        orbitSettings: {
          enableDamping: true,
          enableZoom: true,
          enablePan: false,
          dampingFactor: 0.05,
        },
      },
      reset: {
        position: { x: 0, y: -12, z: 12 },
        target: { x: 0, y: -15, z: 0 },
        orbitSettings: {
          enableDamping: true,
          enableZoom: true,
          enablePan: false,
          dampingFactor: 0.05,
          minDistance: 10,
          maxDistance: 18,
          minPolarAngle: Math.PI / 2.8,
          maxPolarAngle: Math.PI / 2,
          maxAzimuthAngle: Math.PI / 2,
          minAzimuthAngle: Math.PI * 1.5,
        },
      },
    }),
    []
  );

  const animateGateEffect = (toWorld2 = true) => {
    setIsGateTransition(true);
    const tl = gsap.timeline({ onComplete: () => setIsGateTransition(false) });

    const radiusUniform =
      effectsRef.current?.fisheyeEffect?.uniforms.get("eRadius") || {};
    tl.to(radiusUniform, { value: 0, duration: 1.5, ease: "power2.inOut" })
      .call(() => setShowWorld2(toWorld2))
      .to(radiusUniform, { value: 2, duration: 1.5, ease: "power2.inOut" });
  };

  const handleObjectClick = (objectName) => {
    if (isAnimating || isGateTransition) return;
    setIsAnimating(true);
    setClicksLocked(true);

    switch (objectName) {
      case "laptop":
        cameraControlsRef.current?.animateCameraTo("project1", 1.5);
        setCurrentView("project1");
        break;
      case "cityScreen":
        cameraControlsRef.current?.animateCameraTo("project2", 1.5);
        setCurrentView("project2");
        break;
      case "gate":
        cameraControlsRef.current?.animateCameraTo("project3", 2);
        setCurrentView("project3");
        animateGateEffect(true);
        break;
      case "reset":
        cameraControlsRef.current?.animateCameraTo("reset", 2);
        setCurrentView("reset");
        setClicksLocked(false);
        if (showWorld2) animateGateEffect(false);
        break;
      default:
        console.log(`No camera position defined for: ${objectName}`);
        setIsAnimating(false);
        return;
    }

    setTimeout(() => setIsAnimating(false), 2000);
  };

  const handleBackClick = () => {
    if (isAnimating || isGateTransition) return;
    setClicksLocked(false);
    handleObjectClick("reset");
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  const glSettings = useMemo(
    () => ({
      // toneMapping: THREE.ACESFilmicToneMapping,
      // toneMappingExposure: 1.5,
      // outputEncoding: THREE.sRGBEncoding,
      // shadowMapType: THREE.PCFSoftShadowMap,
      powerPerference: "high-performance",
      antialias: true,
      stencil: false,
      depth: true,
    }),
    []
  );

  return (
    <>
      {!loaded && <Loader onLoaded={() => setLoaded(true)} />}

      {startClicked &&
        currentView !== "reset" &&
        currentView !== "project3" && (
          <button
            className="back-button"
            onClick={handleBackClick}
            // disabled={isAnimating || isGateTransition}
            style={{
              position: "fixed",
              top: "20px",
              left: "20px",
              zIndex: 1000,
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderRadius: "50px",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "900",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.5s ease",
              opacity: isAnimating || isGateTransition ? 0.0 : 1,
              transform:
                currentView !== "reset" && currentView !== "project3"
                  ? "translateX(0)"
                  : "translateX(0px)",
            }}
            onMouseEnter={(e) => {
              if (!isAnimating && !isGateTransition)
                e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              if (!isAnimating && !isGateTransition)
                e.target.style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                transform: "scaleX(-1)",
              }}
            >
              &#10140;
            </span>{" "}
            Back
          </button>
        )}

      <Canvas
        dpr={[window.devicePixelRatio, 2]}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
        }}
        shadows={false}
        gl={glSettings}
        camera={{
          position: [
            cameraPositions.free.x,
            cameraPositions.free.y,
            cameraPositions.free.z,
          ],
          fov: 80,
        }}
      >
        {/* <Perf position="top-left" style={{ zIndex: "1000000000" }} /> */}
        <color attach="background" args={["#000"]} />
        <Effects ref={effectsRef} showWorld={showWorld2} />
        {!freeClicked && (
          <Controls
            loaded={loaded}
            freeClicked={setFreeClicked}
            startClicked={startClicked}
          />
        )}
        <World2
          showWorld={showWorld2}
          onObjectClick={handleBackClick}
          clicksLocked={clicksLocked}
        />
        <World
          showWorld={showWorld2}
          loaded={loaded}
          startClicked={startClicked}
          freeStart={freeClicked}
          onObjectClick={handleObjectClick}
          clicksLocked={clicksLocked}
        />
        <Projects showWorld={showWorld2} startClicked={startClicked} />
        {freeClicked && (
          <CameraControls
            ref={cameraControlsRef}
            freeClicked={freeClicked}
            cameraPositions={cameraPositions}
            onObjectClick={handleObjectClick}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        )}
      </Canvas>
      {/* <VisitorCounter /> */}
      {!freeClicked && (
        <Html
          introFinished={loaded}
          setStartClicked={setStartClicked}
          setFreeClicked={setFreeClicked}
        />
      )}

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
          <a
            href="/Portfolio/CV/Amr Khamis.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="fas">CV</p>
          </a>
        </div>
      </div>
    </>
  );
}
