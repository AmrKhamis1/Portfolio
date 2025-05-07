import {
  useGLTF,
  Points,
  PointMaterial,
  useHelper,
  MeshReflectorMaterial,
  Sparkles,
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
    random.inSphere(new Float32Array(30000), { radius: 230.5 })
  );
  useFrame((state, delta) => {
    ref.current.rotation.x = delta / 10;
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
          size={0.05}
          sizeAttenuation={true}
          depthWrite={true}
        />
      </Points>
    </group>
  );
}

export default function World({ loaded }) {
  const { nodes } = useGLTF("./models/new room/Web7.glb");
  const shadows = useRef();
  const shadows1 = useRef();
  const firstMesh = useRef();
  const dirLight = useRef(null);
  // useHelper(dirLight, THREE.PointLightHelper, 1, "red");

  useEffect(() => {
    if (dirLight.current) {
      // dirLight.current.target.position.set(-55, 0, 0); // Target at [0, 0, 0]
      dirLight.current.shadow.normalBias = 0.5;
    }
  }, []);
  const inner = useRef();
  const innerLogo = useRef(null);
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
    if (innerLogo.current) {
      innerLogo.current.rotation.y -= 0.005;
    }
  });
  useEffect(() => {
    if (loaded) {
      animation();
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
  function animation() {
    //logo animation
    // gsap.fromTo(
    //   inner.current.scale,
    //   {
    //     y: 0,
    //   },
    //   {
    //     y: 1,
    //     duration: 6,
    //     ease: "power1.in",
    //     scrollTrigger: {
    //       trigger: ".pref-1",
    //       start: "center 90%",
    //       end: "center 0%",
    //       scrub: 0.5,
    //       toggleActions: "restart none none none",
    //     },
    //   }
    // );
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
  function rotateUVsAroundCenter(geometry, angle) {
    const uvAttribute = geometry.attributes.uv;
    let minU = Infinity,
      minV = Infinity;
    let maxU = -Infinity,
      maxV = -Infinity;

    for (let i = 0; i < uvAttribute.count; i++) {
      const u = uvAttribute.getX(i);
      const v = uvAttribute.getY(i);
      if (u < minU) minU = u;
      if (u > maxU) maxU = u;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }

    const centerU = (minU + maxU) / 2;
    const centerV = (minV + maxV) / 2;

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    for (let i = 0; i < uvAttribute.count; i++) {
      const u = uvAttribute.getX(i) - centerU;
      const v = uvAttribute.getY(i) - centerV;

      const uRot = u * cosAngle - v * sinAngle;
      const vRot = u * sinAngle - v * cosAngle;

      uvAttribute.setXY(i, uRot + centerU, vRot + centerV);
    }

    uvAttribute.needsUpdate = true;
  }

  const [fixedMap, setFixedMap] = useState(null);
  const [fixedGeometry, setFixedGeometry] = useState(null);
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
            if (node.name == "Ref3") {
              const planeRef = useRef();

              useEffect(() => {
                if (node.material.map) {
                  const forcedMap = node.material.map.clone();
                  setFixedMap(forcedMap);
                }
                if (node.geometry?.attributes?.uv) {
                  const oldGeometry = node.geometry.clone();
                  const newPlane = new THREE.PlaneGeometry(3.28855, 3.28855);
                  newPlane.attributes.uv.array.set(
                    oldGeometry.attributes.uv.array
                  );
                  newPlane.attributes.uv.needsUpdate = true;
                  rotateUVsAroundCenter(newPlane, Math.PI);
                  setFixedGeometry(newPlane);
                }
              }, [node]);

              return (
                <mesh
                  key={key}
                  position={node.position}
                  rotation={[Math.PI * 1.5, 0, Math.PI * 3]}
                  scale={node.scale}
                  geometry={fixedGeometry} // Directly attach the new plane with corrected UVs
                >
                  <MeshReflectorMaterial
                    blur={[600, 100]}
                    resolution={1024}
                    mixBlur={0.7}
                    mixStrength={0.7}
                    depthScale={0.5}
                    minDepthThreshold={0.98}
                    metalness={0}
                    roughness={1}
                    map={fixedMap}
                  />
                </mesh>
              );
            } else if (node.name == "AKLogo") {
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
            } else if (node.name == "Cube007") {
              return (
                <mesh
                  key={key}
                  scale={node.scale}
                  position={[
                    node.position.x,
                    node.position.y - 0.2,
                    node.position.z,
                  ]}
                  rotation={node.rotation}
                  geometry={node.geometry}
                  material={node.material}
                ></mesh>
              );
            } else if (node.name == "AreaLight") {
              return <></>;
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
          } else {
            return (
              <pointLight
                key={key}
                color={node.color}
                intensity={node.intensity}
                position={node.position}
                rotation={node.rotation}
                scale={node.scale}
              ></pointLight>
            );
          }
          return null;
        })}

        <mesh ref={firstMesh} position={[0, 0, -10]} scale={[6, 6, 6]}>
          <sphereGeometry args={[1, 25, 25]}></sphereGeometry>
          <meshStandardMaterial
            // wireframe
            roughness={0.9}
            metalness={1}
            color={"#df6dff"}
          ></meshStandardMaterial>
        </mesh>
        <mesh position={[0, -30, -12]} scale={[4, 4, 4]}>
          <sphereGeometry args={[1, 25, 25]}></sphereGeometry>
          <meshStandardMaterial
            roughness={0.8}
            metalness={1}
            color={"#df6dff"}
          ></meshStandardMaterial>
        </mesh>
        <mesh position={[0, -55, -10]} scale={[5, 5, 5]}>
          <sphereGeometry args={[1, 25, 25]}></sphereGeometry>
          <meshStandardMaterial
            roughness={0.8}
            metalness={1}
            color={"#df6dff"}
          ></meshStandardMaterial>
        </mesh>
        <mesh position={[-1, -80, -20]} scale={[10, 10, 10]}>
          <sphereGeometry args={[1, 25, 25]}></sphereGeometry>
          <meshStandardMaterial
            roughness={0.8}
            metalness={1}
            color={"#df6dff"}
          ></meshStandardMaterial>
        </mesh>
        <ambientLight color={0xffffff} intensity={10}></ambientLight>
      </group>
      <Stars></Stars>
    </>
  );
}
