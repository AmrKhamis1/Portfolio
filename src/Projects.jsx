import {
  TextureLoader,
  ShaderMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  Mesh,
  SphereGeometry,
  Clock,
} from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import testVertexShader from "./shaders/projects/vertex.glsl";
import testFregShader from "./shaders/projects/fragment.glsl";
import { randFloat } from "three/src/math/MathUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
function Shaders() {
  const [texture1, texture2, texture3, texture4] = useLoader(TextureLoader, [
    "./imgs/nct.png",
    "./imgs/smar.png",
    "./imgs/sedjet.png",
    "./imgs/net.png",
  ]);
  const geometry = new SphereGeometry(1, 300, 300);
  const numColumns = 300;
  const numLines = 300;
  const initPositions = [];

  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numLines; j++) {
      const initPoint = [
        randFloat(-100, 900),
        randFloat(-100, 900),
        randFloat(-100, 900),
      ];
      initPositions.push(...initPoint);
    }
  }
  const pos = new Float32Array(initPositions);

  geometry.setAttribute("initPosition", new BufferAttribute(pos, 3));

  const material = new ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFregShader,
    uniforms: {
      uPointSize: { value: 2 },
      uTexture1: { value: texture1 },
      uTexture2: { value: texture2 },
      uTexture3: { value: texture3 },
      uTexture4: { value: texture4 },
      uMixFactor: { value: 0 },
      uTime: { value: 0 },
      uNbColumns: { value: numColumns },
      uNbLines: { value: numLines },
      uProgress: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const clock = new Clock();
  useFrame(() => {
    material.uniforms.uTime.value = clock.getElapsedTime() / 1000;
  });
  //animation
  gsap.fromTo(
    material.uniforms.uProgress,
    { value: 0.0 },
    {
      value: 1.0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#technotour",
        start: "top 100%",
        end: "top 60%",
        scrub: 2,
        toggleActions: "restart none none none",
      },
    }
  );
  gsap.fromTo(
    material.uniforms.uProgress,
    { value: 1.0 },
    {
      value: 0.2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#technotour",
        start: "top 40%",
        end: "top 0%",
        scrub: 2,
        toggleActions: "restart none none none",
      },
    }
  );
  gsap.fromTo(
    material.uniforms.uMixFactor,
    { value: 0.0 },
    {
      value: 1.0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#smarthome",
        start: "top 100%",
        end: "top 60%",
        scrub: 2,
        toggleActions: "restart none none none",
      },
    }
  );
  gsap.fromTo(
    material.uniforms.uProgress,
    { value: 0.2 },
    {
      value: 1.0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#smarthome",
        start: "top 100%",
        end: "top 60%",
        scrub: 2,
        toggleActions: "restart none none none",
      },
    }
  );
  return (
    <>
      <primitive object={new Mesh(geometry, material)}></primitive>
    </>
  );
}
export default function Projects() {
  return (
    <>
      <group scale={[6, 6, 6]} position={[90, 100, -110]}>
        <Shaders></Shaders>
      </group>
    </>
  );
}
