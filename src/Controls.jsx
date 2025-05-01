import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ loaded, startClicked }) {
  const cameraRef = useRef();
  // Initialize target with proper starting values
  const target = useRef({ x: 0, y: -16.9, z: 0.3 });
  const statePositions = useRef({ x: 160, y: 0, z: 160 });

  // Cursor tracking for mouse movement
  const cursor = useRef({ x: 0, y: 0 });
  const smoothCursor = useRef({ x: 0, y: 0 });
  const easingFactor = 0.03; // Adjust for smoother/faster movement
  const angel = useRef({ deg: 0 });
  const [contactOut, setContactOut] = useState(false);

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
      // console.log("camera fov:" + cameraRef.current.fov);
      // console.log(
      //   "camera looking at:" + target.current.x,
      //   target.current.y,
      //   target.current.z
      // );

      // Smooth cursor movement
      // smoothCursor.current.x +=
      //   (cursor.current.x - smoothCursor.current.x) * easingFactor;
      // smoothCursor.current.y +=
      //   (cursor.current.y - smoothCursor.current.y) * easingFactor;

      // Camera rotation based on cursor - currently disabled but kept for reference
      // const targetRotationY =
      //   smoothCursor.current.x * 2 - cameraRef.current.rotation.x;
      // const targetRotationX =
      //   -smoothCursor.current.y - cameraRef.current.rotation.y;

      // Apply rotation only when not in skills section
      // Currently disabled but kept for reference
      // cameraRef.current.rotation.y += targetRotationY * easingFactor;
      // cameraRef.current.rotation.x += targetRotationX * easingFactor;
      if (contactOut) {
        angel.current.deg += 0.001;
        cameraRef.current.position.x =
          statePositions.current.x * Math.sin(angel.current.deg);
        cameraRef.current.position.z =
          statePositions.current.z * Math.cos(angel.current.deg);
      }
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
        { x: 0, y: -15.9, z: 260 },
        {
          x: 0,
          y: -15.9,
          z: 55,
          duration: 5,
          ease: "power1.out",
        }
      );
      gsap.fromTo(
        cam,
        { fov: 5 },
        {
          fov: 27,
          duration: 8,
          ease: "power1.out",
          onUpdate: () => {
            cam.updateProjectionMatrix();
            cam.updateMatrixWorld();
            cam.updateWorldMatrix();
          },
        }
      );
      gsap.set(target.current, {
        x: 0,
        y: -16.9,
        z: 0.3,
        duration: 5,
        // ease: "power1.inOut",
      });
    }
  }, [startClicked]);

  // Setup all scroll-based animations
  function setupScrollAnimations() {
    const cam = cameraRef.current;

    gsap.fromTo(
      cam.position,
      { x: 0, y: -15.9, z: 55 },
      {
        x: 0,
        y: -15.9,
        z: 35,
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
      { x: 0, y: -16.9, z: 0 },
      {
        x: 0,
        y: -16.9,
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

    gsap.fromTo(
      cam,
      { fov: 27 },
      {
        fov: 35,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".pref-1",
          start: "top 90%",
          end: "top 0%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onUpdate: () => {
          cam.updateProjectionMatrix();
          cam.updateMatrixWorld();
          cam.updateWorldMatrix();
        },
      }
    );
    // About section
    gsap.fromTo(
      cam.position,
      { x: 0, y: -15.9, z: 35 },
      {
        x: 0,
        y: -49.9,
        z: 25,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".about",
          start: "top 100%",
          end: "top 30%",
          scrub: 2,
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
      { x: 0, y: -16.9, z: 0 },
      {
        x: 0,
        y: -53.2,
        z: 0,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".about",
          start: "top 100%",
          end: "top 30%",
          scrub: 2,
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
      { x: 0, y: -49.9, z: 25 },
      {
        x: 0,
        y: -86.9,
        z: 35,

        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 90%",
          end: "top 10%",
          scrub: 2,
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
      { x: 0, y: -53.2, z: 0 },
      {
        x: 0,
        y: -91.9,
        z: 0,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 90%",
          end: "top 10%",
          scrub: 2,
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
      { x: 0, y: -86.9, z: 35 }, // This position seems disconnected from previous animations
      {
        x: 0,
        y: -133.3,
        z: 35,

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
      { x: 0, y: -91.9, z: 0 }, // This position also seems disconnected
      {
        x: 0,
        y: -135.7,
        z: 0,
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

    // fun section
    gsap.fromTo(
      cam.position,
      { x: 84.6, y: -13.3, z: 46.03 }, // This position seems disconnected from previous animations
      {
        x: 100.4,
        y: -14.3,
        z: 51.2,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".fun-h1",
          start: "top 100%",
          end: "top 60%",
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
      { x: 104.5, y: -13.1, z: 46.3 }, // This position also seems disconnected
      {
        x: 104.5,
        y: -14.3,
        z: 51.2,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".fun-h1",
          start: "top 100%",
          end: "top 60%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
        },
        onStart: () => {
          console.log("projects completed");
        },
      }
    );

    // contact section
    gsap.fromTo(
      cam.position,
      { x: -121.2, y: 41, z: -3 }, // This position seems disconnected from previous animations
      {
        x: statePositions.current.x * Math.sin(angel.current.deg),
        y: 55,
        z: statePositions.current.z * Math.cos(angel.current.deg),
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 100%",
          end: "top 60%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
          onEnterBack: () => {
            setContactOut(false);
            angel.current.deg = 0;
          },
        },
        onComplete: () => {
          console.log("contact completed");
          setContactOut(true);
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -163.5, y: 32.6, z: -3 }, // This position also seems disconnected
      {
        x: 0,
        y: 30,
        z: -3,
        ease: "power1.inOut",
        duration: 2,
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 100%",
          end: "top 60%",
          scrub: 2,
          invalidateOnRefresh: true,
          toggleActions: "start none none none",
          onEnterBack: () => {
            setContactOut(false);
          },
        },
        onComplete: () => {
          console.log("contact completed");
          setContactOut(true);
        },
      }
    );
  }

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, -15.9, 260]}
      fov={5}
      near={0.1}
      far={1000}
    />
  );
}
