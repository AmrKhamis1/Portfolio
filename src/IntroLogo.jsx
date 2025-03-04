import { useGLTF, Float, Text, Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useState, useRef } from "react";
import * as random from "maath/random/dist/maath-random.esm";

function Stars(props, { coloring }) {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(10000), { radius: 150.5 })
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

export default function LogoIntro({ startAnimation }) {
  const { nodes } = useGLTF("./models/main logo/AK 3D.glb");
  const logoMaterial = useRef();
  const shadows = useRef();
  const texts = useRef();
  useFrame(() => {
    texts.current.rotation.z -= 0.001;
  });
  setInterval(() => {
    if (logoMaterial.current != undefined && shadows.current != undefined) {
      if (logoMaterial.current.color.r == 0.5) {
        gsap.to(shadows.current.color, {
          r: 1,
          g: 0,
          b: 1,
          duration: 5,
          ease: "expo.inOut",
        });
        gsap.to(logoMaterial.current.color, {
          r: 5,
          g: 0.5,
          b: 5,
          duration: 5,
          ease: "expo.inOut",
        });
      } else if (logoMaterial.current.color.r == 5) {
        gsap.to(shadows.current.color, {
          r: 0,
          g: 1,
          b: 1,
          duration: 5,
          ease: "expo.inOut",
        });
        gsap.to(logoMaterial.current.color, {
          r: 0.5,
          g: 5,
          b: 5,
          duration: 5,
          ease: "expo.inOut",
        });
      }
    }
  }, 5000);

  return (
    <>
      <group position={[0, 4, 0]}>
        <Stars coloring={logoMaterial} />
        <Float
          position={[-2, 1, 2]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            HTML
          </Text>
        </Float>

        <Float
          position={[-5, 2, -2]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            CSS
          </Text>
        </Float>

        <Float
          position={[-1, 5, -2]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            JS
          </Text>
        </Float>

        <Float
          position={[3, 2, 0]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            React
          </Text>
        </Float>

        <Float
          position={[3, 3, 1]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            Node JS
          </Text>
        </Float>

        <Float
          position={[1, 5, -3]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            Express JS
          </Text>
        </Float>
        <Float
          position={[-4, 3, -3]}
          floatingRange={[0, 0.5]}
          floatIntensity={2}
          speed={2}
        >
          <Text
            font="./NewAmsterdam-Regular.woff"
            color="#eeeeee"
            scale={[0.3, 0.3, 0.3]}
            castShadow={false}
          >
            Graphic Design
          </Text>
        </Float>
        <mesh
          ref={texts}
          geometry={nodes.Plane.geometry}
          position={[nodes.Plane.position.x - 0.1, 2, nodes.Plane.position.z]}
          rotation={[nodes.Plane.rotation.x, 0, 0]}
        >
          <meshBasicMaterial
            toneMapped={true}
            ref={logoMaterial}
            color={[0.5, 5, 5]}
          ></meshBasicMaterial>
        </mesh>
      </group>

      <pointLight ref={shadows} intensity={90} position={[0, 1, 0]} />
      <ambientLight color={0xffffff} intensity={3}></ambientLight>
    </>
  );
}
