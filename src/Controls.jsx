import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ loaded }) {
  const cameraRef = useRef();
  const target = useRef({ x: 0, y: 0, z: 60 }); // Target reference for lookAt
  const cursor = { x: 0, y: 0 };
  const smoothCursor = { x: 0, y: 0 };
  const easingFactor = 0.1; // Adjust this value to control smoothness (lower = smoother)

  window.addEventListener("mousemove", (event) => {
    if (cameraRef.current) {
      cursor.x = -event.clientX / window.innerWidth - 0.5;
      cursor.y = -event.clientY / window.innerHeight - 0.5;
    }
  });

  useFrame(() => {
    if (cameraRef.current) {
      // Smooth interpolation for cursor movement
      smoothCursor.x += (cursor.x - smoothCursor.x) * easingFactor;
      smoothCursor.y += (cursor.y - smoothCursor.y) * easingFactor;

      // LookAt target remains the same
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );

      // Apply eased rotation
      const targetRotationY = smoothCursor.x * 2 - cameraRef.current.rotation.x;
      const targetRotationX = -smoothCursor.y - cameraRef.current.rotation.y;

      // Smooth rotation with easing
      cameraRef.current.rotation.y += targetRotationY * easingFactor;
      cameraRef.current.rotation.x += targetRotationX * easingFactor;
    }
  });
  useEffect(() => {
    if (loaded && cameraRef.current) {
      const cam = cameraRef.current;
      cam.position.set([0, 150, 60]);
      animations();
      gsap.fromTo(
        cam.position,
        { x: 0, y: 150, z: 60 },
        { x: 0, y: 45, z: 60, duration: 4 }
      );

      gsap.fromTo(
        target.current,
        { x: 0, y: 0, z: 60 },
        { x: 0, y: 0, z: 60, duration: 4 }
      );

      gsap.fromTo(cam, { fov: 100 }, { fov: 90, duration: 4 });
    }
  }, [loaded]);

  function animations() {
    const cam = cameraRef.current;

    gsap.fromTo(
      cam.position,
      { x: 0, y: 45, z: 60 },
      {
        x: -35,
        y: 8,
        z: 0,
        duration: 6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 80%",
          end: "top 10%",
          scrub: true,
          toggleActions: "restart none none none",
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: 0, z: 60 },
      {
        x: -35,
        y: 8,
        z: -3,
        duration: 6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 80%",
          end: "top 10%",
          scrub: true,
          toggleActions: "restart none none none",
        },
      }
    );

    gsap.fromTo(
      cam.position,
      { x: -35, y: 8, z: 0 },
      {
        x: -11.75,
        y: 9.2,
        z: -31.17,
        duration: 6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".about-h1",
          start: "center 90%",
          end: "center 30%",
          scrub: true,
          toggleActions: "restart none none none",
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -35, y: 8, z: -3 },
      {
        x: -9.5,
        y: 9.06,
        z: -33.1,
        duration: 6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".about-h1",
          start: "center 90%",
          end: "center 30%",
          scrub: true,
          toggleActions: "restart none none none",
        },
      }
    );
  }

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 150, 60]}
      fov={100}
      near={0.1}
      far={1000}
    />
  );
}
