import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger);

export default function Controls({ startClicked, loaded }) {
  const cameraRef = useRef();
  const target = useRef({ x: 0, y: -17, z: 0 });
  const statePositions = useRef({ x: 160, y: 0, z: 20 / 1.838 });
  const angel = useRef({ deg: 0 });
  const [contactOut, setContactOut] = useState(false);

  // Camera frame update loop
  useFrame(() => {
    if (cameraRef.current) {
      // Always make sure camera is looking at the target
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );
      // console.log(target.current.x, target.current.y, target.current.z);
      // console.log(
      //   cameraRef.current.position.x,
      //   cameraRef.current.position.y,
      //   cameraRef.current.position.z
      // );

      // if (contactOut) {
      //   angel.current.deg += 0.001;
      //   cameraRef.current.position.x =
      //     statePositions.current.x * Math.sin(angel.current.deg);
      //   cameraRef.current.position.z =
      //     statePositions.current.z * Math.cos(angel.current.deg);
      // }
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
      const targetWidth = 20; // adjust to match your visible object size

      gsap.fromTo(
        cam,
        { fov: 85 },
        {
          fov: 5,
          duration: 4,
          ease: "power3.out",
          onUpdate: () => {
            // Recalculate Z-distance using the dolly zoom formula
            const fovRad = THREE.MathUtils.degToRad(cam.fov);
            const distance = targetWidth / (2 * Math.tan(fovRad / 2));

            cam.position.z = distance;
            cam.updateProjectionMatrix();
          },
        }
      );
    }
  }, [startClicked]);

  // Setup all scroll-based animations
  function setupScrollAnimations() {
    const cam = cameraRef.current;
    // ScrollTrigger.defaults({
    //   markers: true, // will show green/pink lines in the browser
    // });

    // Logo section animation
    // ScrollTrigger.config({ preventOverlaps: "group" });

    // Contact section
    gsap.fromTo(
      cam.position,
      { x: -121.2, y: 41, z: -3 },
      {
        x: statePositions.current.x * Math.sin(angel.current.deg),
        y: 55,
        z: statePositions.current.z * Math.cos(angel.current.deg),
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 100%",
          end: "top 60%",
          scrub: true,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
          onEnterBack: () => {
            setContactOut(false);
            angel.current.deg = 0;
          },
        },
        onComplete: () => {
          setContactOut(true);
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -163.5, y: 32.6, z: -3 },
      {
        x: 0,
        y: 30,
        z: -3,
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 100%",
          end: "top 60%",
          scrub: true,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
          onEnterBack: () => {
            setContactOut(false);
          },
        },
        onComplete: () => {
          setContactOut(true);
        },
      }
    );

    // Fun section
    gsap.fromTo(
      cam.position,
      { x: 0, y: -87, z: 35 },
      {
        x: 0,
        y: -130,
        z: 35,
        scrollTrigger: {
          trigger: ".fun-h1",
          start: "top 100%",
          end: "top 20%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: -87, z: 35 },
      {
        x: 0,
        y: -130,
        z: 35,
        scrollTrigger: {
          trigger: ".fun-h1",
          start: "top 100%",
          end: "top 20%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
      }
    );

    // Skills section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 10, z: 120 },
      {
        x: 0,
        y: -20,
        z: 160,
        scrollTrigger: {
          trigger: ".skills",
          start: "center 70%",
          end: "center 0%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: -53, z: 0 },
      {
        x: 0,
        y: -92,
        z: 0,
        scrollTrigger: {
          trigger: ".skills",
          start: "center 70%",
          end: "center 0%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );

    // About section
    gsap.fromTo(
      cam.position,
      { x: 0, y: 20, z: 220 },
      {
        x: 0,
        y: 10,
        z: 120,
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          end: "center 0%",
          scrub: 1,
          fastScrollEnd: true,
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: -16, z: 0 },
      {
        x: 0,
        y: -53,
        z: 0,
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          end: "center 0%",
          scrub: 1,
          fastScrollEnd: true,
        },
      }
    );

    // Logo section
    gsap.fromTo(
      cam.position,
      { x: 0, y: -17, z: 229.037655484312 },
      {
        x: 0,
        y: 20,
        z: 220,
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
      { x: 0, y: -17, z: 0 },
      {
        x: 0,
        y: -17,
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

    gsap.fromTo(
      cam,
      { fov: 5 },
      {
        fov: 5,
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 70%",
          end: "top 0%",
          scrub: 1,
          fastScrollEnd: true,
        },
        onUpdate: () => {
          cam.updateProjectionMatrix();
        },
      }
    );
  }

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, -17, 20 / 1.838]}
      fov={85}
      near={0.1}
      far={2000}
    />
  );
}
