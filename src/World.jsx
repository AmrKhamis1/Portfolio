import {
  useGLTF,
  MeshReflectorMaterial,
  Points,
  PointMaterial,
} from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import * as random from "maath/random/dist/maath-random.esm";

gsap.registerPlugin(ScrollTrigger);

function Stars(props, { coloring }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(50000), { radius: 150.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
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
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Blender(props) {
  const { nodes } = useGLTF("./models/new room/blender.glb");
  return (
    <>
      <mesh key={3} position={[-0.68, 2.1, -2.65]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={4} position={[-0.68, 2.1, -2.8]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={5} position={[-0.68, 2.1, -3]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={6} position={[-0.68, 2.1, -3.2]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={7} position={[-0.68, 2.1, -3.4]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={8} position={[-0.68, 2.1, -3.6]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={9} position={[-0.68, 2.1, -3.8]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
      <mesh key={10} position={[-0.68, 2.1, -4]}>
        <torusGeometry args={[0.25, 0.005, 9, 100]}></torusGeometry>
        <meshBasicMaterial color={[0.4, 1, 6]}></meshBasicMaterial>
      </mesh>
    </>
  );
}

export default function World({ loaded }) {
  const { nodes } = useGLTF("./models/new room/world.glb");
  const shadows = useRef();
  const shadows1 = useRef();

  const inner = useRef();
  const innerLogo = useRef();
  const outerLogo = useRef();
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "./videos/vid.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);

  useFrame(() => {
    //logo spinning
    innerLogo.current.rotation.y -= 0.005;
    outerLogo.current.rotation.y -= 0.005;
  });
  useEffect(() => {
    if (loaded) {
      animation();
    }
  }, [loaded]);
  function animation() {
    //logo animation
    gsap.fromTo(
      inner.current.scale,
      {
        y: 0,
      },
      {
        y: 1,
        duration: 6,
        ease: "power1.in",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "center 90%",
          end: "center 0%",
          scrub: true,
          toggleActions: "restart none none none",
        },
      }
    );
    gsap.to(shadows.current.color, {
      r: 1,
      g: 0,
      b: 1,
      duration: 6,
      ease: "power1.in",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "center 90%",
        end: "center 0%",
        scrub: true,
        toggleActions: "restart none none none",
      },
    });
    gsap.to(shadows1.current.color, {
      r: 1,
      g: 0,
      b: 1,
      duration: 6,
      ease: "power1.in",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "center 90%",
        end: "center 0%",
        scrub: true,
        toggleActions: "restart none none none",
      },
    });
  }

  return (
    <>
      <group
        key={30}
        position={[0, -17, 0]}
        rotation={[0, 0, 0]}
        scale={[12.5, 12.5, 12.5]}
      >
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];
          if (node.isMesh) {
            if (node.name == "inner") {
              return (
                <mesh
                  ref={inner}
                  key={key}
                  scale={[1, 0.2, 1]}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                >
                  {/* <meshStandardMaterial map={modelMaterial} /> */}
                </mesh>
              );
            } else if (node.name == "logoInner") {
              return (
                <mesh
                  ref={innerLogo}
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                >
                  {/* <meshStandardMaterial map={modelMaterial} /> */}
                </mesh>
              );
            } else if (node.name == "logoOuter") {
              return (
                <mesh
                  ref={outerLogo}
                  key={key}
                  scale={node.scale}
                  position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                >
                  <meshStandardMaterial color={[0.2, 0.2, 0.2]} />
                </mesh>
              );
            } else if (node.name == "screen") {
              return (
                <mesh
                  key={key}
                  scale={[0.13, 0.14, 0.2]}
                  position={[-0.61, 2.1, -2.649]}
                  rotation={[0, Math.PI * 1.5, 0]}
                >
                  <planeGeometry></planeGeometry>
                  <meshBasicMaterial toneMapped={false}>
                    <videoTexture
                      attach="map"
                      args={[video]}
                      encoding={THREE.sRGBEncoding}
                    />
                  </meshBasicMaterial>
                </mesh>
              );
            } else if (node.name == "reflection") {
              return (
                <>
                  <mesh
                    key={key}
                    scale={node.scale}
                    position={node.position}
                    rotation={node.rotation}
                    geometry={node.geometry}
                  >
                    <MeshReflectorMaterial blur={[300, 300]} color="#001f60" />
                  </mesh>
                  <mesh
                    key={20}
                    scale={[0.1, 0.2, 0.2]}
                    position={[-0.677, 2.007, -2.65]}
                    rotation={[Math.PI * 1.5, 0, 0]}
                  >
                    <planeGeometry args={[1, 1]}></planeGeometry>
                    <MeshReflectorMaterial
                      blur={[600, 600]}
                      resolution={512}
                      mixBlur={1}
                      mixStrength={80}
                      roughness={1}
                      depthScale={1}
                      minDepthThreshold={0.4}
                      maxDepthThreshold={1.4}
                      color="#080814"
                    />
                  </mesh>
                  <Blender></Blender>
                </>
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
                ></mesh>
              );
            }
          }
          return null;
        })}
        {/* <pointLight intensity={90} position={[0, 5, 0]} /> */}
        <pointLight
          ref={shadows1}
          color={[0, 1, 1]}
          intensity={290}
          position={[-3, 2, -1]}
        />
        <pointLight
          ref={shadows}
          color={[0, 1, 1]}
          intensity={290}
          position={[-2.5, 2, -1]}
        />
        <pointLight intensity={290} position={[-2.5, 3, -1]} />
        <pointLight intensity={90} position={[-0.8, 2.193, -2.649]} />

        <ambientLight color={0xffffff} intensity={1}></ambientLight>
      </group>
      <Stars></Stars>
    </>
  );
}
