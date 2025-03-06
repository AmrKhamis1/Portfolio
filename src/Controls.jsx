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
        cameraRef.current.rotation.y += targetRotationY * easingFactor;
        cameraRef.current.rotation.x += targetRotationX * easingFactor;
      } else {
        gsap.fromTo(
          cameraRef.current.rotation,
          {
            x: cameraRef.current.rotation.x,
            y: cameraRef.current.rotation.y,
          },
          {
            x: cameraRef.current.rotation.x,
            y: cameraRef.current.rotation.y,
            duration: 2,
          }
        );
      }
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
        { x: 0, y: 45, z: 60, duration: 2 }
      );

      gsap.fromTo(
        target.current,
        { x: 0, y: 0, z: 60 },
        { x: 0, y: 0, z: 60, duration: 2 }
      );

      gsap.fromTo(cam, { fov: 100 }, { fov: 90, duration: 2 });
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
          start: "top 90%",
          end: "top 0%",
          scrub: 0.5,
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
          start: "top 90%",
          end: "top 0%",
          scrub: 0.5,
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
          end: "center 10%",
          scrub: 0.5,
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
          end: "center 10%",
          scrub: 0.5,
          toggleActions: "restart none none none",
        },
      }
    );
    gsap.fromTo(
      cam.position,
      { x: -11.75, y: 9.2, z: -31.17 },
      {
        x: -8.75,
        y: 15,
        z: -75,
        ease: "power1.in",
        duration: 6,

        scrollTrigger: {
          trigger: ".skill-btn",
          start: "top 100%",
          end: "top 30%",
          scrub: 0.5,
          toggleActions: "restart none none none",
        },
        onStart: () => {
          setSkillEnter(true);
        },
        onReverseComplete: () => {
          setSkillEnter(false);
        },
        onComplete: () => {
          setSkillEnter(false);
        },
        onUpdate: () => {
          setSkillEnter(true);
        },
      }
    );

    gsap.fromTo(
      target.current,
      { x: -9.5, y: 9.06, z: -33.1 },
      {
        x: -9,
        y: 15,
        z: -90,
        ease: "power1.in",
        duration: 6,

        scrollTrigger: {
          trigger: ".skill-btn",
          start: "top 100%",
          end: "top 30%",
          scrub: 0.5,
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
