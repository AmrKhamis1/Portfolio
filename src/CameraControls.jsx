import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";

const CameraControls = forwardRef(({ freeClicked, cameraPositions }, ref) => {
  const orbitRef = useRef(null);
  const animationRef = useRef(null);
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.object.aspect = window.innerWidth / window.innerHeight;
      orbitRef.current.object.updateProjectionMatrix();
    }
  }, [freeClicked]);
  // expose the orbit controls
  useImperativeHandle(ref, () => ({
    orbit: orbitRef.current,
    animateCameraTo: async (name, duration = 2) => {
      if (!orbitRef.current) return;

      // killing animations
      if (animationRef.current) {
        animationRef.current.kill();
      }

      const orbit = orbitRef.current;

      let targetConfig;

      //  target configurations
      if (name === "project1") {
        targetConfig = {
          position: cameraPositions.project1.position,
          target: cameraPositions.project1.target,
          controls: {
            enableRotate: false,
            minDistance: 1,
            maxDistance: 4,
            maxAzimuthAngle: Math.PI * 1.59,
            minAzimuthAngle: Math.PI * 1.59,
          },
        };
      } else if (name === "project2") {
        targetConfig = {
          position: cameraPositions.project2.position,
          target: cameraPositions.project2.target,
          controls: {
            enableRotate: false,
            minDistance: 2,
            maxDistance: 5,
            maxAzimuthAngle: Math.PI * 2.005,
            minAzimuthAngle: Math.PI * 2.005,
          },
        };
      } else if (name === "project3") {
        targetConfig = {
          position: cameraPositions.project3.position,
          target: cameraPositions.project3.target,
          controls: {
            enableRotate: true,
            minDistance: 7,
            maxDistance: 18,
            maxAzimuthAngle: Math.PI / 2.5,
            minAzimuthAngle: Math.PI * 1.6,
          },
        };
      } else if (name === "reset") {
        targetConfig = {
          position: cameraPositions.reset.position,
          target: cameraPositions.reset.target,
          controls: {
            enableRotate: true,
            minDistance: 7,
            maxDistance: 18,
            maxAzimuthAngle: Math.PI / 2.2,
            minAzimuthAngle: Math.PI * 1.5,
          },
        };
      }

      if (!targetConfig) return;

      // Disable controls
      orbit.enabled = false;
      orbit.enableRotate = false;
      orbit.enableZoom = false;
      orbit.update();

      // camera position
      gsap.to(orbit.object.position, {
        duration: duration,
        ease: "power1.inOut",
        x: targetConfig.position.x,
        y: targetConfig.position.y,
        z: targetConfig.position.z,
      });

      // target position
      gsap.to(orbit.target, {
        duration: duration,
        ease: "power1.inOut",
        x: targetConfig.target.x,
        y: targetConfig.target.y,
        z: targetConfig.target.z,
        onUpdate: () => {
          orbit.update();
        },
      });

      // control constraints
      const currentConstraints = {
        minDistance: orbit.minDistance,
        maxDistance: orbit.maxDistance,
        maxAzimuthAngle: orbit.maxAzimuthAngle,
        minAzimuthAngle: orbit.minAzimuthAngle || 0,
      };

      gsap.to(currentConstraints, {
        duration: duration,
        ease: "power1.inOut",
        minDistance: targetConfig.controls.minDistance,
        maxDistance: targetConfig.controls.maxDistance,
        maxAzimuthAngle: targetConfig.controls.maxAzimuthAngle,
        minAzimuthAngle: targetConfig.controls.minAzimuthAngle || 0,

        onUpdate: () => {
          orbit.minDistance = currentConstraints.minDistance;
          orbit.maxDistance = currentConstraints.maxDistance;
          orbit.maxAzimuthAngle = currentConstraints.maxAzimuthAngle;
          orbit.minAzimuthAngle = currentConstraints.minAzimuthAngle;
          orbit.enableRotate = false;
          orbit.enableZoom = false;
          orbit.enabled = false;
          orbit.update();
        },
      });
      await new Promise((resolve) =>
        setTimeout(resolve, (duration + 0.1) * 1000)
      );
      orbit.enabled = true;
      orbit.enableRotate = targetConfig.controls.enableRotate;
      orbit.enableZoom = true;
    },
  }));

  useMemo(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      enableRotate={freeClicked}
      enabled={freeClicked}
      enableDamping={freeClicked}
      enableZoom={freeClicked}
      enablePan={false}
      dampingFactor={0.05}
      minDistance={7}
      maxDistance={18}
      minPolarAngle={Math.PI / 2.8}
      maxPolarAngle={Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      minAzimuthAngle={Math.PI * 1.5}
      target={[
        cameraPositions.initTarget.x,
        cameraPositions.initTarget.y,
        cameraPositions.initTarget.z,
      ]}
    />
  );
});

CameraControls.displayName = "CameraControls";
export default CameraControls;
