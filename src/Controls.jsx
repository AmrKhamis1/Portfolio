import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ loaded, startClicked }) {
  const cameraRef = useRef();
  // Initialize target with proper starting values
  const target = useRef({ x: 0, y: 0, z: 80 });
  // Cursor tracking for mouse movement
  const cursor = useRef({ x: 0, y: 0 });
  const smoothCursor = useRef({ x: 0, y: 0 });
  const easingFactor = 0.03; // Adjust for smoother/faster movement

  const [skillEnter, setSkillEnter] = useState(false);

  // // Mouse event listener
  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     if (cameraRef.current) {
  //       cursor.current.x = -event.clientX / window.innerWidth - 0.5;
  //       cursor.current.y = event.clientY / window.innerHeight - 0.5;
  //     }
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);

  //   // Clean up event listener on unmount
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  // Camera frame update loop
  useFrame(() => {
    if (cameraRef.current) {
      // Always make sure camera is looking at the target
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );
      // console.log(
      //   "camera position:" + cameraRef.current.position.x,
      //   cameraRef.current.position.y,
      //   cameraRef.current.position.z
      // );
      // console.log(
      //   "camera looking at:" + target.current.x,
      //   target.current.y,
      //   target.current.z
      // );

      // Smooth cursor movement
      smoothCursor.current.x +=
        (cursor.current.x - smoothCursor.current.x) * easingFactor;
      smoothCursor.current.y +=
        (cursor.current.y - smoothCursor.current.y) * easingFactor;

      // Camera rotation based on cursor - currently disabled but kept for reference
      const targetRotationY =
        smoothCursor.current.x * 2 - cameraRef.current.rotation.x;
      const targetRotationX =
        -smoothCursor.current.y - cameraRef.current.rotation.y;

      // Apply rotation only when not in skills section
      // Currently disabled but kept for reference
      /*
      if (!skillEnter) {
        cameraRef.current.rotation.y += targetRotationY * easingFactor;
        cameraRef.current.rotation.x += targetRotationX * easingFactor;
      }
      */
    }
  });

  // Handle initial camera animation when start button is clicked
  useEffect(() => {
    if (startClicked && cameraRef.current) {
      setupScrollAnimations();
    }
  }, [startClicked]);

  useEffect(() => {
    if (startClicked && cameraRef.current) {
      const cam = cameraRef.current;

      gsap.fromTo(
        cam.position,
        { x: 0, y: 120, z: 81 },
        {
          x: 0,
          y: 55,
          z: 81,
          duration: 5,
        }
      );
      gsap.fromTo(
        cam,
        { fov: 120 },
        {
          fov: 90,
          duration: 5,
        }
      );
      gsap.set(target.current, {
        x: 0,
        y: 0,
        z: 80,
        duration: 5,
      });
    }
  }, [startClicked]);

  // Setup all scroll-based animations
  function setupScrollAnimations() {
    const cam = cameraRef.current;

    gsap.fromTo(
      cam.position,
      { x: 0, y: 55, z: 81 },
      {
        x: -65,
        y: 15,
        z: 20,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 90%",
          end: "top 0%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("logo completed");
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: 0, y: 0, z: 80 },
      {
        x: -85,
        y: 7,
        z: 0,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 90%",
          end: "top 0%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },

        onStart: () => {
          console.log("logo completed");
        },
      }
    );

    // About section
    gsap.fromTo(
      cam.position,
      { x: -65, y: 15, z: 20 },
      {
        x: -65,
        y: 15,
        z: -5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".about",
          start: "top 100%",
          end: "top 30%",
          scrub: 1,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("about completed");
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -85, y: 7, z: 0 },
      {
        x: -85,
        y: 15,
        z: -10,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".about",
          start: "top 100%",
          end: "top 30%",
          scrub: 1,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("about completed");
        },
      }
    );

    // Skills section
    gsap.fromTo(
      cam.position,
      { x: -65, y: 15, z: -5 },
      {
        x: -90,
        y: 16,
        z: -34,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
          toggleActions: "start none none none",
          invalidateOnRefresh: true,
        },
        onStart: () => {
          console.log("skiils completed");
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -85, y: 15, z: -10 },
      {
        x: -95,
        y: 16,
        z: -38,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("skiils completed");
        },
      }
    );

    // Projects section
    gsap.fromTo(
      cam.position,
      { x: -8.75, y: 15, z: -75 }, // This position seems disconnected from previous animations
      {
        x: 90,
        y: 100,
        z: -90,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".projects-h1",
          start: "top 100%",
          end: "top 30%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("projects completed");
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -9, y: 15, z: -100 }, // This position also seems disconnected
      {
        x: 90,
        y: 100,
        z: -110,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".projects-h1",
          start: "top 100%",
          end: "top 30%",
          scrub: 1,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("projects completed");
        },
      }
    );
  }

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 120, 81]}
      fov={120}
      near={0.1}
      far={1000}
    />
  );
}
