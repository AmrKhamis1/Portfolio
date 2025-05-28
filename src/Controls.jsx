import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ startClicked, loaded, freeStart }) {
  const cameraRef = useRef();
  const target = useRef({ x: 0, y: 1, z: 0 });

  // prevent duplication
  const animationsSetup = useRef(false);

  // Memoized scroll animations setup
  const setupScrollAnimations = useCallback(() => {
    if (!cameraRef.current || animationsSetup.current) return;

    const cam = cameraRef.current;
    animationsSetup.current = true;

    // free section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 3, z: 8 },
      {
        x: 0,
        y: -12,
        z: 12,
        scrollTrigger: {
          trigger: ".about",
          start: "top 85%",
          end: "top 0%",
          scrub: 0.5,
        },
      }
    );
    gsap.fromTo(
      target.current,
      { x: 0, y: 0, z: 0 },
      {
        x: 0,
        y: -15,
        z: 0,
        scrollTrigger: {
          trigger: ".about",
          start: "top 85%",
          end: "top 0%",
          scrub: 0.5,
        },
      }
    );

    // logo section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 2, z: 6.553 },
      {
        x: 0,
        y: 3,
        z: 8,
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 100%",
          end: "top 20%",
          scrub: 0.5,
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: 1, z: 0 },
      {
        x: 0,
        y: 0,
        z: 0,
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 100%",
          end: "top 20%",
          scrub: 0.5,
        },
      }
    );
  }, []);

  // target look at update
  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );
    }
  });

  // setups
  useEffect(() => {
    if (startClicked && cameraRef.current) {
      setupScrollAnimations();
    }
  }, [startClicked, setupScrollAnimations]);

  // initial camera
  useEffect(() => {
    if (!startClicked || !loaded || !cameraRef.current) return;

    const cam = cameraRef.current;
    const targetWidth = 11;

    // timeline
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        cam,
        { fov: 5 },
        {
          fov: 80,
          duration: 6,
          ease: "power2.out",
          onUpdate: () => {
            // The Dolly Zoom
            const fovRad = THREE.MathUtils.degToRad(cam.fov);
            const distance = targetWidth / (2 * Math.tan(fovRad / 2));

            cam.position.z = distance;
            cam.updateProjectionMatrix();
          },
        }
      )
      .fromTo(
        cam.position,
        { y: 1 },
        {
          y: 2,
          duration: 6,
          ease: "power2.out",
        },
        0
      );
  }, [startClicked, loaded]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1, 125.936]}
      fov={5}
      near={0.1}
      far={2000}
    />
  );
}
