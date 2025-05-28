import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import gsap from "gsap";
import Loader from "./Loader";
import "./CSS/index.css";
import Html from "./Html.jsx";
import Controls from "./Controls.jsx";
import World from "./World.jsx";
import Effects from "./Effects.jsx";
import Projects from "./Projects.jsx";
import CameraControls from "./CameraControls.jsx";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [freeClicked, setFreeClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentView, setCurrentView] = useState("reset"); // Track current view
  const [clicksLocked, setClicksLocked] = useState(false); // New state for click locking

  // Camera controls ref
  const cameraControlsRef = useRef(null);

  // Define camera positions and orbit settings for different views
  const cameraPositions = useMemo(
    () => ({
      free: {
        x: 0,
        y: -12,
        z: 12,
      },
      initTarget: {
        x: 0,
        y: -15,
        z: 0,
      },
      project1: {
        position: { x: -5.8, y: -12.8, z: 0.4 },
        target: { x: -4.7, y: -15.0, z: 0.07 },
        orbitSettings: {
          enableDamping: false,
          enableZoom: false,
          enablePan: false,
          enableRotate: false,
          dampingFactor: 0.05,
          minDistance: 5,
          maxDistance: 15,
          minPolarAngle: Math.PI / 4,
          maxPolarAngle: Math.PI / 1.5,
          maxAzimuthAngle: Math.PI / 3,
          minAzimuthAngle: -Math.PI / 3,
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
          minDistance: 6,
          maxDistance: 12,
          minPolarAngle: Math.PI / 3,
          maxPolarAngle: Math.PI / 1.8,
          maxAzimuthAngle: Math.PI / 2,
          minAzimuthAngle: -Math.PI / 4,
        },
      },
      aboutSection: {
        position: { x: 0, y: -5, z: 10 },
        target: { x: 0, y: -8, z: 0 },
        orbitSettings: {
          enableDamping: true,
          enableZoom: true,
          enablePan: false,
          dampingFactor: 0.05,
          minDistance: 8,
          maxDistance: 20,
          minPolarAngle: Math.PI / 6,
          maxPolarAngle: Math.PI / 2.2,
          maxAzimuthAngle: Math.PI / 4,
          minAzimuthAngle: -Math.PI / 4,
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

  // Handle object clicks
  const handleObjectClick = (objectName) => {
    if (isAnimating) return; // Prevent clicks if locked or animating

    setIsAnimating(true);
    setClicksLocked(true); // Lock clicks after first interaction

    switch (objectName) {
      case "laptop":
        cameraControlsRef.current?.animateCameraTo("project1", 1);
        setCurrentView("project1");
        break;
      case "cityScreen":
        cameraControlsRef.current?.animateCameraTo("project2", 1);
        setCurrentView("project2");
        break;
      case "gate":
        cameraControlsRef.current?.animateCameraTo("aboutSection", 1);
        setCurrentView("aboutSection");
        break;
      case "reset":
        cameraControlsRef.current?.animateCameraTo("reset", 1);
        setCurrentView("reset");
        setClicksLocked(false); // Unlock clicks when returning to reset view
        break;
      default:
        console.log(`No camera position defined for: ${objectName}`);
        setIsAnimating(false);
        return;
    }

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  // Handle back button click
  const handleBackClick = () => {
    if (isAnimating) return;
    setClicksLocked(false);
    handleObjectClick("reset");
  };

  // Free mode handler
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

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

  return (
    <>
      {!loaded && <Loader onLoaded={() => setLoaded(true)} />}

      {/* Back Button */}
      {startClicked && currentView !== "reset" && (
        <button
          className="back-button"
          onClick={handleBackClick}
          disabled={isAnimating}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1000,
            padding: "12px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50px",
            color: "white",
            cursor: isAnimating ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            opacity: isAnimating ? 0.5 : 1,
            transform:
              currentView !== "reset" ? "translateX(0)" : "translateX(-100px)",
          }}
          onMouseEnter={(e) => {
            if (!isAnimating) {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
              e.target.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnimating) {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "scale(1)";
            }
          }}
        >
          <span style={{ fontSize: "18px" }}>←</span>
          Back
        </button>
      )}

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
        camera={{
          position: [
            cameraPositions.free.x,
            cameraPositions.free.y,
            cameraPositions.free.z,
          ],
          fov: 80,
        }}
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
          onObjectClick={handleObjectClick}
          clicksLocked={clicksLocked} // Pass the lock state to World component
        />
        <Projects startClicked={startClicked} />

        <CameraControls
          ref={cameraControlsRef}
          freeClicked={freeClicked}
          cameraPositions={cameraPositions}
          onObjectClick={handleObjectClick}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
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
