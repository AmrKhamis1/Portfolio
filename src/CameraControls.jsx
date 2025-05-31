import { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";

const CameraControls = forwardRef(
  ({ freeClicked, cameraPositions, onObjectClick }, ref) => {
    const orbitRef = useRef(null);
    const animationRef = useRef(null);

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
              enableRotate: true,
              minDistance: 1,
              maxDistance: 1,
              maxAzimuthAngle: cameraPositions.project1.maxAzimuthAngle,
              minAzimuthAngle: undefined,
            },
          };
        } else if (name === "project2") {
          targetConfig = {
            position: cameraPositions.project2.position,
            target: cameraPositions.project2.target,
            controls: {
              enableRotate: true,
              minDistance: 4.5,
              maxDistance: 4.5,
              maxAzimuthAngle: Math.PI / 3.8,
              minAzimuthAngle: Math.PI * 1.8,
            },
          };
        } else if (name === "project3") {
          targetConfig = {
            position: cameraPositions.project3.position,
            target: cameraPositions.project3.target,
            controls: {
              enableRotate: true,
              minDistance: 10,
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
              minDistance: 12,
              maxDistance: 12,
              maxAzimuthAngle: Math.PI / 2,
              minAzimuthAngle: Math.PI * 1.5,
            },
          };
        }

        if (!targetConfig) return;

        // Disable controls
        const originalRotate = false;
        const originalZoom = false;
        orbit.enableRotate = false;
        orbit.enableZoom = false;
        orbit.enableDamping = false;

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
            orbit.enableDamping = false;
            orbit.update();
          },
        });
        await new Promise((resolve) =>
          setTimeout(resolve, (duration + 0.1) * 1000)
        );
        // orbit.minDistance = targetConfig.controls.minDistance;
        // orbit.maxDistance = targetConfig.controls.maxDistance;
        // orbit.maxAzimuthAngle = targetConfig.controls.maxAzimuthAngle;
        // orbit.minAzimuthAngle = targetConfig.controls.minAzimuthAngle;
        orbit.enableRotate = true;
        orbit.enableZoom = true;
        orbit.enableDamping = true;
        orbit.update();
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
        minDistance={12}
        maxDistance={12.5}
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
  }
);

CameraControls.displayName = "CameraControls";
export default CameraControls;
