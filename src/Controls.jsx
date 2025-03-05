import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Controls({ loaded }) {
  const controls = useRef();
  const [animationDone, setAnimationDone] = useState(false);

  useFrame(() => {
    controls.current.update();
  });
  // Initial animation sequence
  useEffect(() => {
    if (loaded && controls.current != undefined) {
      animations();
    }
  }, [loaded]);

  function animations() {
    const cam = controls.current.object;
    const target = controls.current.target;
    const controlles = controls.current;

    gsap.to(
      cam.position,
      // {
      //   x: 0,
      //   y: 150,
      //   z: 60,
      // },
      {
        x: 0,
        y: 55,
        z: 60,
        duration: 2,
        ease: "power1.out",
      }
    );
    gsap.to(
      target,
      // {
      //   x: 0,
      //   y: 0,
      //   z: 60,
      // },
      {
        x: 0,
        y: 0,
        z: 60,
        duration: 2,
        ease: "power1.out",
      }
    );
    // Animate FOV for cinematic effect
    gsap.to(
      cam,
      // {
      //   fov: 100,
      // },
      {
        fov: 90,
        duration: 2,
        ease: "power1.out",
      }
    );
    gsap.fromTo(
      cam.position,
      {
        x: 0,
        y: 55,
        z: 60,
      },
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
      target,
      {
        x: 0,
        y: 0,
        z: 60,
      },
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
      {
        x: -35,
        y: 8,
        z: 0,
      },
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
      target,
      {
        x: -35,
        y: 8,
        z: -3,
      },
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
          // markers: true,

          toggleActions: "restart none none none",
        },
      }
    );
  }

  return (
    <OrbitControls
      ref={controls}
      target={[0, 0, 60]}
      enableZoom={false} // Disable zoom to preserve the artistic camera movement
      enablePan={false} // Disable panning for the same reason
      enableRotate={false} // We're handling rotation ourselves
    />
  );
}
