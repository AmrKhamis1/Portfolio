import { useGLTF, shaderMaterial } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, extend } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import vertexShader from "./shaders/gate/vertex.glsl";
import fragmentShader from "./shaders/gate/fragment.glsl";

const GateMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#000"), // first color
    uColor2: new THREE.Color("#ff8200"), // secound color
    uColor3: new THREE.Color("#000"), // thired color
    uResolution: new THREE.Vector2(600, 900), // screen resolution
    uScale: 1.0, // scale factor
    uPixelFilter: 745.0, // pixel filter value
    uSpinSpeed: 7.0, // spin speed
    uContrast: 3.5, // Contrast
    uBloomIntensity: 7.0, // bloom intensity
    uGlowStrength: 2.5, // glow
  },
  vertexShader,
  fragmentShader
);

extend({ GateMaterial });

export default function World2({ showWorld, onObjectClick }) {
  const { nodes } = useGLTF("./models/new room/web 2.glb");

  const gateMaterialRef = useRef();
  const group = useRef();
  const handleMeshClick = (objectName) => {
    // if (clicksLocked) return; // Prevent clicks if locked

    // console.log("animate");
    if (onObjectClick) {
      onObjectClick();
    }
  };
  useEffect(() => {
    if (!showWorld && group.current) {
      gsap.to(group.current.scale, {
        y: 0.01,
        x: 0.01,
        z: 0.01,
        duration: 0.5,
      });
    } else if (showWorld && group.current) {
      gsap.to(group.current.scale, { y: 1.5, x: 1.5, z: 1.5, duration: 0.5 });
    } else {
      null;
    }
  }, [showWorld]);
  useFrame((state) => {
    if (gateMaterialRef.current) {
      gateMaterialRef.current.uTime = state.clock.elapsedTime * 5;
    }
  });

  return (
    <>
      <group
        key={50}
        ref={group}
        position={[0, -17, 0]}
        rotation={[0, 0, 0]}
        scale={[1.5, 1.5, 1.5]}
      >
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];

          if (node.isMesh) {
            if (node.name === "gate") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  frustumCulled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeshClick("reset");
                  }}
                  onPointerOver={(e) =>
                    (document.body.style.cursor = "pointer")
                  }
                  onPointerOut={(e) => (document.body.style.cursor = "auto")}
                >
                  <planeGeometry args={[1.035, 1.4]}></planeGeometry>
                  <gateMaterial ref={gateMaterialRef} side={THREE.DoubleSide} />
                </mesh>
              );
            } else {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  frustumCulled={false}
                />
              );
            }
          }
          return null;
        })}
        {showWorld && (
          <pointLight
            position={[1, 5, 4]}
            color={"#ffaa00"}
            rotation={[Math.PI / 1, 0, 0]}
            intensity={100}
            castShadow
          />
        )}
      </group>
    </>
  );
}
