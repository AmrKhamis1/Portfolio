import { useGLTF, Points, PointMaterial, useHelper } from "@react-three/drei";
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
    random.inSphere(new Float32Array(5000), { radius: 140.5 })
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

export default function World({ loaded }) {
  const { nodes } = useGLTF("./models/new room/web3.glb");
  const shadows = useRef();
  const shadows1 = useRef();

  const dirLight = useRef(null);
  useHelper(dirLight, THREE.PointLightHelper, 1, "red");

  useEffect(() => {
    if (dirLight.current) {
      // dirLight.current.target.position.set(-55, 0, 0); // Target at [0, 0, 0]
      dirLight.current.shadow.normalBias = 0.5;
    }
  }, []);
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
          scrub: 0.5,
          toggleActions: "restart none none none",
        },
      }
    );
    // gsap.to(shadows.current.color, {
    //   r: 1,
    //   g: 0,
    //   b: 1,
    //   duration: 6,
    //   ease: "power1.in",
    //   scrollTrigger: {
    //     trigger: ".pref-1",
    //     start: "center 90%",
    //     end: "center 0%",
    //     scrub: 0.5,
    //     toggleActions: "restart none none none",
    //   },
    // });
    // gsap.to(shadows1.current.color, {
    //   r: 1,
    //   g: 0,
    //   b: 1,
    //   duration: 6,
    //   ease: "power1.in",
    //   scrollTrigger: {
    //     trigger: ".pref-1",
    //     start: "center 90%",
    //     end: "center 0%",
    //     scrub: 0.5,
    //     toggleActions: "restart none none none",
    //   },
    // });
  }

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
            if (node.name == "inner") {
              return (
                <mesh
                  ref={inner}
                  key={key}
                  scale={[1, 0.2, 1]}
                  // position={node.position}
                  // rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  receiveShadow
                  castShadow
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
                  // position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  receiveShadow
                  castShadow
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
                  // position={node.position}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                  receiveShadow
                  castShadow
                >
                  <meshStandardMaterial color={[0.2, 0.2, 0.2]} />
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
                  receiveShadow
                  castShadow
                ></mesh>
              );
            }
          }
          return null;
        })}
        {/* <pointLight intensity={90} position={[0, 5, 0]} /> */}

        <pointLight
          ref={dirLight}
          color={[1, 1, 1]}
          intensity={256}
          position={[-6, 1.8, -1]}
          castShadow
          shadow-radius={100} // Increases softness
        ></pointLight>

        {/* <pointLight
          ref={shadows}
          color={[0, 1, 1]}
          intensity={2}
          position={[2.5, 5, -1]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.001}
          shadow-normalBias={0.005}
        /> */}
        <pointLight intensity={290} castShadow position={[-2.5, 3, -1]} />
        <pointLight
          intensity={90}
          castShadow
          position={[-0.8, 2.193, -2.649]}
        />

        <ambientLight color={0xffffff} intensity={1}></ambientLight>
      </group>
      <Stars></Stars>
    </>
  );
}
