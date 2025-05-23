import {
  useGLTF,
  Points,
  PointMaterial,
  Html,
  shaderMaterial,
  Text,
  Float,
} from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";
import vertexShader from "./shaders/gate/vertex.glsl";
import fragmentShader from "./shaders/gate/fragment.glsl";

gsap.registerPlugin(ScrollTrigger);

// Create the shader material with imported shaders
// Enhanced shader material with bloom-ready intensity
const GateMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#000"), // Orange/red
    uColor2: new THREE.Color("#ff8200"), // White
    uColor3: new THREE.Color("#000"), // Dark background
    uResolution: new THREE.Vector2(600, 900), // Screen resolution for effect
    uScale: 1.0, // Scale factor for the entire effect
    uPixelFilter: 745.0, // Pixel filter value
    uSpinSpeed: 7.0, // Spin speed
    uContrast: 3.5, // Contrast
    uBloomIntensity: 3.0, // New: Bloom intensity multiplier
    uGlowStrength: 2.5, // New: Glow strength for bright areas
  },
  // Vertex shader remains the same
  vertexShader,
  // Enhanced fragment shader with bloom intensity
  fragmentShader
);
// Extend to make it available in JSX
extend({ GateMaterial });

function Starss(props, { coloring }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 50 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x = delta / 90;
    ref.current.rotation.y -= delta / 90;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color={coloring}
          size={0.001}
          sizeAttenuation={false}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function World({ loaded }) {
  const { nodes } = useGLTF("./models/new room/web.glb");
  const firstMesh = useRef();
  const dirLight = useRef(null);
  const gateMaterialRef = useRef();

  const videoRef = useRef();

  const [videoTexture, setVideoTexture] = useState(null);

  // Setup video texture
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/videos/v.mp4"; // Put your video file in `public/videos/`
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    setVideoTexture(texture);
    videoRef.current = video;
  }, []);

  useEffect(() => {
    if (dirLight.current) {
      dirLight.current.shadow.normalBias = 0.5;
    }
  }, []);

  const innerLogo = useRef(null);

  useFrame((state) => {
    // Logo spinning
    if (innerLogo.current) {
      innerLogo.current.rotation.y -= 0.001;
    }

    // Update gate shader time uniform for animation
    if (gateMaterialRef.current) {
      gateMaterialRef.current.uTime = state.clock.elapsedTime * 5;

      // Optional: Animate bloom intensity for dynamic effects
      // gateMaterialRef.current.uBloomIntensity = 2.0 + Math.sin(state.clock.elapsedTime * 0.5) * 1.0;
    }
  });

  useEffect(() => {
    if (innerLogo.current) {
      innerLogo.current.material.metalness = 1.05;
      innerLogo.current.material.roughness = 0.65;
      innerLogo.current.material.emissiveIntensity = 0.4;
    }
    if (firstMesh.current) {
      gsap.fromTo(
        firstMesh.current.position,
        { y: 0 },
        {
          y: -2,
          scrollTrigger: {
            trigger: ".pref-1",
            start: "top 70%",
            end: "top 0%",
            scrub: 1,
            fastScrollEnd: true,
          },
        }
      );
    }
  }, [loaded]);

  return (
    <>
      <group
        key={30}
        position={[0, -17, 0]}
        rotation={[0, 0, 0]}
        scale={[1.5, 1.5, 1.5]}
      >
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];

          if (node.isMesh) {
            if (node.name == "moon") {
              return (
                <mesh
                  key={key}
                  ref={innerLogo}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                ></mesh>
              );
            } else if (node.name === "gate") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                >
                  <planeGeometry args={[1.035, 1.4]}></planeGeometry>
                  <gateMaterial ref={gateMaterialRef} side={THREE.DoubleSide} />
                </mesh>
              );
            } else if (node.name === "screenbig") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                >
                  <planeGeometry args={[2.2, 1.3]}></planeGeometry>
                  {videoTexture && (
                    <meshBasicMaterial
                      map={videoTexture}
                      toneMapped={false}
                      side={THREE.DoubleSide}
                    />
                  )}
                </mesh>
              );
            } else if (node.name === "laptopScreen") {
              return (
                <mesh
                  key={key}
                  geometry={nodes["laptopScreen"].geometry}
                  position={node.position}
                  rotation={node.rotation}
                  scale={node.scale}
                >
                  <meshStandardMaterial transparent opacity={1} />
                  <Html
                    transform
                    position={[-0.01, 0, 0]}
                    rotation={[-0.78, -1.21, -0.745]}
                    scale={[0.33, 0.32, 0.01]}
                    wrapperClass="htmlScreen"
                    distanceFactor={0.9}
                    occlude="blending"
                  >
                    <iframe
                      src="./website/index.html"
                      title="Laptop Screen"
                      onPointerDown={(e) => e.stopPropagation()}
                    />
                  </Html>
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
                />
              );
            }
          } else {
            return (
              <pointLight
                key={key}
                color={node.color}
                intensity={node.intensity}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
              />
            );
          }
          return null;
        })}

        <ambientLight color={0xffffff} intensity={1} />
      </group>
      <Starss />
    </>
  );
}
