import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
export default function Controls({ loaded, animation }) {
  const controls = useRef();
  const [animationDone, setAnimationDone] = useState(false);
  const lerpFactor = useRef(0);
  let angle = useRef(0);
  const radius = 10; // Distance from the logo

  // Mouse position tracking
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Mouse sensitivity - adjust these values to control how much the camera moves
  const mouseSensitivity = 0.1;
  const easeStrength = 0.05;

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Calculate normalized mouse position (-1 to 1)
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Set target rotation based on mouse position
      targetRotation.current.x = mouse.current.x * mouseSensitivity;
      targetRotation.current.y = mouse.current.y * mouseSensitivity;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Initial animation sequence
  useEffect(() => {
    if (loaded) {
      const cam = controls.current.object;
      // GSAP animation to move the camera
      gsap.to(cam.position, {
        x: 0,
        y: 55,
        z: 60,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          // Calculate the initial angle based on where GSAP ends
          angle.current = Math.atan2(cam.position.z, cam.position.x);

          // Smooth transition to rotation mode
          gsap.to(lerpFactor, {
            value: 1,
            duration: 2,
            ease: "power3.inOut",
            onComplete: () => setAnimationDone(true), // Changed to true to enable rotation
          });
        },
      });

      // Animate FOV for cinematic effect
      gsap.to(cam, {
        fov: 90,
        duration: 6,
        ease: "power2.out",
        onUpdate: () => cam.updateProjectionMatrix(),
      });
    }
  }, [loaded]);

  useFrame(() => {
    if (!controls.current) return;

    const cam = controls.current.object;

    // if (animationDone) {
    //   // Base circular movement
    //   angle.current += 0.001; // Smoothly increase angle
    //   const baseX = Math.cos(angle.current) * radius;
    //   const baseZ = Math.sin(angle.current) * radius;

    //   // Apply mouse-based rotation easing
    //   currentRotation.current.x +=
    //     (targetRotation.current.x - currentRotation.current.x) * easeStrength;
    //   currentRotation.current.y +=
    //     (targetRotation.current.y - currentRotation.current.y) * easeStrength;

    //   // Apply rotations to camera position
    //   const targetX = baseX + currentRotation.current.x * 15; // Horizontal mouse influence
    //   const targetZ = baseZ - currentRotation.current.y * 10; // Vertical mouse influence
    //   const targetY = 50 + currentRotation.current.y * 10; // Height adjustment based on mouse

    //   // Smooth camera position transition
    //   cam.position.x += (targetX - cam.position.x) * 0.05;
    //   cam.position.z += (targetZ - cam.position.z) * 0.05;
    //   cam.position.y += (targetY - cam.position.y) * 0.05;

    //   // Always look at the center point
    //   cam.lookAt(0, 0, 60);
    // } else {
    // During initial animation, just keep looking at center
    // }

    // Update controls
    controls.current.update();
  });

  return (
    <OrbitControls
      ref={controls}
      target={[0, 0, 60]}
      enableZoom={true} // Disable zoom to preserve the artistic camera movement
      enablePan={true} // Disable panning for the same reason
      enableRotate={true} // We're handling rotation ourselves
    />
  );
}
