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
  const easingFactor = 0.03; // Adjust this value to control smoothness (lower = smoother)
  const [skillEnter, setSkillEnter] = useState(false);
  window.addEventListener("mousemove", (event) => {
    if (cameraRef.current) {
      cursor.x = -event.clientX / window.innerWidth - 0.5;
      cursor.y = event.clientY / window.innerHeight - 0.5;
    }
  });

  useFrame(() => {
    if (cameraRef.current) {
      // LookAt target remains the same
      cameraRef.current.lookAt(
        target.current.x,
        target.current.y,
        target.current.z
      );

      smoothCursor.x += (cursor.x - smoothCursor.x) * easingFactor;
      smoothCursor.y += (cursor.y - smoothCursor.y) * easingFactor;
      const targetRotationY = smoothCursor.x * 2 - cameraRef.current.rotation.x;
      const targetRotationX = -smoothCursor.y - cameraRef.current.rotation.y;
      if (!skillEnter) {
        // cameraRef.current.rotation.y += targetRotationY * easingFactor;
        // cameraRef.current.rotation.x += targetRotationX * easingFactor;
      } else {
        // gsap.fromTo(
        //   cameraRef.current.rotation,
        //   {
        //     x: cameraRef.current.rotation.x,
        //     y: cameraRef.current.rotation.y,
        //   },
        //   {
        //     x: cameraRef.current.rotation.x,
        //     y: cameraRef.current.rotation.y,
        //     duration: 2,
        //   }
        // );
      }
    }
  });
  useEffect(() => {
    if (loaded && cameraRef.current) {
      const cam = cameraRef.current;
      cam.position.set([0, 150, 81]);
      animations();
      gsap.fromTo(
        cam.position,
        { x: 0, y: 250, z: 81 },
        { x: 0, y: 55, z: 81, duration: 2 }
      );

      gsap.to(target.current, { x: 0, y: 0, z: 80 });

      gsap.fromTo(cam, { fov: 120 }, { fov: 90, duration: 4 });
    }
  }, [loaded]);

  function animations() {
    const cam = cameraRef.current;
    //logo
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
          toggleActions: "restart none none none",
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
          toggleActions: "restart none none none",
        },
      }
    );
    //about
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
          toggleActions: "restart none none none",
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
          toggleActions: "restart none none none",
        },
      }
    );
    //skills
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
          toggleActions: "restart none none none",
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
          toggleActions: "restart none none none",
        },
      }
    );
    //projects
    gsap.fromTo(
      cam.position,
      { x: -8.75, y: 15, z: -75 },
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
          toggleActions: "restart none none none",
        },
      }
    );
    gsap.fromTo(
      target.current,
      { x: -9, y: 15, z: -100 },
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
