import { useGLTF, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

export default function Room() {
  const { nodes } = useGLTF("./models/new room/building.glb");
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "./videos/vid.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);
  return (
    <>
      <group position={[0, 1.5, 110]} rotation={[0, 0, 0]} scale={[4, 4, 4]}>
        <pointLight intensity={90} position={[1.4, 1, 0]} />
        <pointLight intensity={90} position={[1.4, 3, -1]} />

        <primitive object={nodes.Scene}>
          <meshStandardMaterial
            attach="material"
            color={"#ffffff"}
          ></meshStandardMaterial>
        </primitive>
        <mesh position={[0.611, 2.45, 0.18]} rotation={[0, Math.PI * 0.5, 0]}>
          <planeGeometry args={[1.22, 1.02]}></planeGeometry>
          <meshBasicMaterial toneMapped={false}>
            <videoTexture
              attach="map"
              args={[video]}
              encoding={THREE.sRGBEncoding}
            />
          </meshBasicMaterial>
        </mesh>
        <mesh position={[0.6, 1.94, 0.19]} rotation={[Math.PI * -0.5, 0, 0]}>
          <planeGeometry args={[1.1, 1.24]}></planeGeometry>
          <MeshReflectorMaterial
            blur={[300, 30]}
            resolution={512}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#202020"
            metalness={0.8}
          />
        </mesh>
      </group>
    </>
  );
}
