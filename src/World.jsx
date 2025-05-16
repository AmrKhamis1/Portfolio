import { useGLTF, Points, PointMaterial } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as random from "maath/random/dist/maath-random.esm";

gsap.registerPlugin(ScrollTrigger);

function Stars(props, { coloring }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(3000), { radius: 50.5 })
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
          sizeAttenuation={true}
          depthWrite={true}
        />
      </Points>
    </group>
  );
}

export default function World({ loaded }) {
  const { nodes } = useGLTF("./models/new room/web.glb");
  const firstMesh = useRef();
  const dirLight = useRef(null);

  useEffect(() => {
    if (dirLight.current) {
      dirLight.current.shadow.normalBias = 0.5;
    }
  }, []);
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
      innerLogo.current.rotation.y -= 0.001;
    }
  });
  useEffect(() => {
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

        <ambientLight color={0xffffff} intensity={1}></ambientLight>
      </group>
      <Stars></Stars>
    </>
  );
}
