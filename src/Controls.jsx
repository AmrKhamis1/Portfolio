import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger);

export default function Controls({ startClicked, loaded }) {
  const cameraRef = useRef();
  const target = useRef({ x: 0, y: 0, z: 0 });

  // Camera frame update loop
  useFrame(() => {
    if (cameraRef.current) {
      // Always make sure camera is looking at the target
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );
    }
  });
  useEffect(() => {
    if (startClicked && cameraRef.current) {
      setupScrollAnimations();
    }
  }, [startClicked]);

  useEffect(() => {
    if (startClicked && loaded && cameraRef.current) {
      const cam = cameraRef.current;
      const targetWidth = 11; // adjust to match your visible object size

      gsap.fromTo(
        cam,
        { fov: 5 },
        {
          fov: 80,
          duration: 6,
          ease: "power2.out",
          onUpdate: () => {
            // Recalculate Z-distance using the dolly zoom formula
            const fovRad = THREE.MathUtils.degToRad(cam.fov);
            const distance = targetWidth / (2 * Math.tan(fovRad / 2));

            cam.position.z = distance;
            cam.updateProjectionMatrix();
          },
        }
      );
      gsap.fromTo(
        cam.position,
        { y: 5 },
        {
          y: 1,
          duration: 6,
          ease: "power2.out",
        }
      );
    }
  }, [startClicked]);

  // Setup all scroll-based animations
  function setupScrollAnimations() {
    const cam = cameraRef.current;

    // About section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 2, z: 8 },
      {
        x: 5,
        y: -12,
        z: 12,
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          end: "top 0%",
          scrub: 1,
          fastScrollEnd: true,
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
          start: "top 70%",
          end: "top 0%",
          scrub: 1,
          fastScrollEnd: true,
        },
      }
    );

    // Logo section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 1, z: 6.553 },
      {
        x: 0,
        y: 2,
        z: 8,
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 70%",
          end: "top 0%",
          scrub: 1,
          fastScrollEnd: true,
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: 0, z: 0 },
      {
        x: 0,
        y: 0,
        z: 0,
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

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 5, 125.936]}
      fov={5}
      near={0.1}
      far={2000}
    />
  );
}
