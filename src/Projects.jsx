import {
  TextureLoader,
  ShaderMaterial,
  BufferAttribute,
  Mesh,
  SphereGeometry,
  Clock,
} from "three";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import testVertexShader from "./shaders/projects/vertex.glsl";
import testFregShader from "./shaders/projects/fragment.glsl";
import { randFloat } from "three/src/math/MathUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
gsap.registerPlugin(ScrollTrigger);

function Shaders() {
  const geometry = new THREE.TorusGeometry(2.5, 0.4, 10, 30);

  // shader material
  const uniforms = {
    uTime: { value: 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: testVertexShader,
    fragmentShader: testFregShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false, // so smoke blends correctly
    blending: THREE.AdditiveBlending,
  });
  useFrame(() => {
    material.uniforms.uTime.value += 0.01;
  });

  return (
    <>
      <primitive object={new Mesh(geometry, material)}></primitive>
    </>
  );
}
export default function Projects({ startClicked }) {
  const groups = useRef(null);
  useEffect(() => {
    if (startClicked) {
      gsap.fromTo(
        groups.current.scale,
        { z: 1 },
        {
          z: 100,
          duration: 5,
        }
      );
    }
  }, [startClicked]);
  return (
    <>
      <group
        ref={groups}
        scale={[1, 1, 1]}
        position={[0, 117, 81]}
        rotation={[Math.PI * 0.5, 0, 0]}
      >
        <Shaders></Shaders>
      </group>
    </>
  );
}
