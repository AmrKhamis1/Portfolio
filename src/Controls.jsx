import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ freeClicked, startClicked, loaded }) {
  const cameraRef = useRef();
  const target = useRef({ x: 0, y: 1, z: 0 });
  const camPotition = useRef({ x: 0, y: 0, z: 0 });

  const animationsSetup = useRef(false);

  // Get viewport size for responsive calculations
  const { size } = useThree();

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
          start: "top 70%",
          end: "top 0%",
          scrub: 0.5,
        },
        onComplete: () => {
          freeClicked(true);
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
          scrub: 0.5,
        },
      },
      0
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
          end: "top 40%",
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
          end: "top 40%",
          scrub: 0.5,
        },
      },
      0
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

  // Handle resize events - Force update projection matrix
  useEffect(() => {
    if (cameraRef.current && (startClicked || loaded)) {
      const cam = cameraRef.current;
      // Update aspect ratio based on current size
      cam.aspect = size.width / size.height;
      cam.updateProjectionMatrix();
    }
  }, [size.width, size.height, startClicked, loaded]);

  // initial camera animation
  useEffect(() => {
    if (!startClicked || !loaded || !cameraRef.current) return;

    const cam = cameraRef.current;
    const targetWidth = 11;

    // Ensure proper aspect ratio before animation
    cam.aspect = size.width / size.height;
    cam.updateProjectionMatrix();

    // timeline
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        cam,
        { fov: 1 },
        {
          fov: 80,
          duration: 4,
          ease: "power4.out",
          onUpdate: () => {
            // The Dolly Zoom - Update aspect ratio during animation
            cam.aspect = size.width / size.height;
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
          duration: 4,
          ease: "power1.out",
        },
        0
      );
  }, [startClicked, loaded, size.width, size.height]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1, 630.24]}
      fov={1}
      near={0.1}
      far={1000}
    />
  );
}
