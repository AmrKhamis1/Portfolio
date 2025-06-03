import {
  useGLTF,
  Points,
  PointMaterial,
  Html,
  shaderMaterial,
  Text,
  Float,
  Outlines,
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

function Starss(props, { coloring }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 50 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x = delta / 20;
    ref.current.rotation.y -= delta / 20;
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

export default function World({
  loaded,
  freeStart,
  onObjectClick,
  clicksLocked,
  showWorld,
}) {
  const { nodes } = useGLTF("./models/new room/web.glb");
  const firstMesh = useRef();
  const gateMaterialRef = useRef();
  const group = useRef();
  const [outLineHoverd, setOutLineHoverd] = useState(false);
  const [outLine2Hoverd, setOutLine2Hoverd] = useState(false);

  const videoRef = useRef();
  const [videoTexture, setVideoTexture] = useState(null);

  // Handle mesh clicks with lock check
  const handleMeshClick = (objectName) => {
    if (clicksLocked) return; // Prevent clicks if locked

    console.log("animate");
    if (onObjectClick) {
      onObjectClick(objectName);
    }
  };
  useEffect(() => {
    if (showWorld && group.current) {
      gsap.to(group.current.scale, {
        y: 0.01,
        x: 0.01,
        z: 0.01,
        duration: 0.5,
      });
    } else if (!showWorld && group.current) {
      gsap.to(group.current.scale, {
        y: 1.5,
        x: 1.5,
        z: 1.5,
        duration: 0.5,
      });
    } else {
      null;
    }
  }, [showWorld]);
  // video
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/Portfolio/videos/v.mp4";
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

  // useEffect(() => {
  //   if (dirLight.current) {
  //     dirLight.current.shadow.normalBias = 0.5;
  //   }
  // }, []);

  const innerLogo = useRef(null);

  useFrame((state) => {
    // moon spinning
    if (innerLogo.current) {
      innerLogo.current.rotation.y -= 0.001;
    }

    // update gate shader
    if (gateMaterialRef.current) {
      gateMaterialRef.current.uTime = state.clock.elapsedTime * 5;
    }
  });

  useEffect(() => {
    if (!freeStart) {
      if (innerLogo.current) {
        innerLogo.current.material.metalness = 1;
        innerLogo.current.material.roughness = 0.75;
        innerLogo.current.material.emissiveIntensity = 0.8;
      }
    } else {
      if (innerLogo.current) {
        innerLogo.current.visible = false;
      }
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
  }, [loaded, freeStart]);

  return (
    <>
      <group
        ref={group}
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
                  frustumCulled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeshClick("gate");
                  }}
                  onPointerOver={(e) =>
                    !clicksLocked && (document.body.style.cursor = "pointer")
                  }
                  onPointerOut={(e) => (document.body.style.cursor = "auto")}
                >
                  <planeGeometry args={[1.035, 1.4]}></planeGeometry>
                  <gateMaterial ref={gateMaterialRef} side={THREE.DoubleSide} />
                </mesh>
              );
            } else if (node.name == "screenbig") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  frustumCulled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeshClick("cityScreen");
                    setOutLine2Hoverd(false);
                  }}
                  onPointerOver={() => {
                    !clicksLocked && (document.body.style.cursor = "pointer");
                    !clicksLocked && setOutLine2Hoverd(true);
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto";
                    !clicksLocked && setOutLine2Hoverd(false);
                  }}
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
            } else if (node.name == "cityScreen") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  frustumCulled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeshClick("cityScreen");
                    setOutLine2Hoverd(false);
                  }}
                  onPointerOver={() => {
                    !clicksLocked && (document.body.style.cursor = "pointer");
                    !clicksLocked && setOutLine2Hoverd(true);
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto";
                    !clicksLocked && setOutLine2Hoverd(false);
                  }}
                >
                  <Outlines
                    thickness={3}
                    color={"#888"}
                    visible={outLine2Hoverd}
                    frustumCulled={false}
                  ></Outlines>
                </mesh>
              );
            } else if (node.name == "laptop") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  frustumCulled={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMeshClick("laptop");
                    setOutLineHoverd(false);
                  }}
                  onPointerOver={() => {
                    !clicksLocked && (document.body.style.cursor = "pointer");
                    !clicksLocked && setOutLineHoverd(true);
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto";
                    !clicksLocked && setOutLineHoverd(false);
                  }}
                >
                  <Outlines
                    thickness={3}
                    color={"#888"}
                    visible={outLineHoverd}
                    frustumCulled={false}
                  ></Outlines>
                </mesh>
              );
            } else if (node.name == "laptopScreen") {
              return (
                <mesh
                  key={key}
                  geometry={nodes["laptopScreen"].geometry}
                  position={node.position}
                  rotation={node.rotation}
                  scale={node.scale}
                  frustumCulled={false}
                >
                  <meshStandardMaterial transparent opacity={1} />
                  <Html
                    transform
                    position={[-0.01, 0, 0]}
                    rotation={[-0.78, -1.21, -0.745]}
                    scale={[0.33, 0.32, 0.01]}
                    wrapperClass="htmlScreen"
                    distanceFactor={0.9}
                    center
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
                  frustumCulled={false}
                />
              );
            }
          } else {
            if (node.name.includes("Point")) {
              if (!showWorld) {
                return (
                  <pointLight
                    key={key}
                    color={node.color}
                    intensity={20}
                    position={node.position}
                    rotation={node.rotation}
                    scale={node.scale}
                  />
                );
              }
            }
          }
          return null;
        })}
      </group>
      <ambientLight color={0xffffff} intensity={2} />

      {!showWorld && <Starss />}
    </>
  );
}
