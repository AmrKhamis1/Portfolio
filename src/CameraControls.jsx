import { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";

const CameraControls = forwardRef(
  ({ freeClicked, cameraPositions, onObjectClick }, ref) => {
    const orbitRef = useRef(null);
    const animationRef = useRef(null);

    // Expose the orbit controls ref to parent component
    useImperativeHandle(ref, () => ({
      orbit: orbitRef.current,
      animateCameraTo: (name, duration = 2) => {
        if (!orbitRef.current) return;

        // Kill any existing animation
        if (animationRef.current) {
          animationRef.current.kill();
        }

        const orbit = orbitRef.current;
        const currentPosition = { ...orbit.object.position };
        const currentTarget = { ...orbit.target };

        let targetConfig;

        // Define target configurations
        if (name === "project1") {
          targetConfig = {
            position: cameraPositions.project1.position,
            target: cameraPositions.project1.target,
            controls: {
              enableRotate: true,
              minDistance: 1,
              maxDistance: 2,
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
              minDistance: 3,
              maxDistance: 5,
              maxAzimuthAngle: Math.PI / 3.8,
              minAzimuthAngle: Math.PI * 1.8,
            },
          };
        } else if (name === "reset") {
          targetConfig = {
            position: cameraPositions.reset.position,
            target: cameraPositions.reset.target,
            controls: {
              enableRotate: true,
              minDistance: 10,
              maxDistance: 18,
              maxAzimuthAngle: Math.PI / 2,
              minAzimuthAngle: Math.PI * 1.5,
            },
          };
        }

        if (!targetConfig) return;

        // Create timeline for coordinated animation
        const tl = gsap.timeline({
          ease: "power2.inOut",
          onComplete: () => {
            // Ensure final values are set precisely
            orbit.object.position.set(
              targetConfig.position.x,
              targetConfig.position.y,
              targetConfig.position.z
            );
            orbit.target.set(
              targetConfig.target.x,
              targetConfig.target.y,
              targetConfig.target.z
            );
            orbit.update();
          },
        });

        // Animate camera position
        tl.to(
          currentPosition,
          {
            x: targetConfig.position.x,
            y: targetConfig.position.y,
            z: targetConfig.position.z,
            duration: duration,
            onUpdate: () => {
              orbit.object.position.set(
                currentPosition.x,
                currentPosition.y,
                currentPosition.z
              );
            },
          },
          0
        );

        // Animate target position
        tl.to(
          currentTarget,
          {
            x: targetConfig.target.x,
            y: targetConfig.target.y,
            z: targetConfig.target.z,
            duration: duration,
            onUpdate: () => {
              orbit.target.set(
                currentTarget.x,
                currentTarget.y,
                currentTarget.z
              );
              orbit.update();
            },
          },
          0
        );

        // Animate control constraints
        const currentConstraints = {
          minDistance: orbit.minDistance,
          maxDistance: orbit.maxDistance,
          maxAzimuthAngle: orbit.maxAzimuthAngle,
          minAzimuthAngle: orbit.minAzimuthAngle || 0,
        };

        tl.to(
          currentConstraints,
          {
            minDistance: targetConfig.controls.minDistance,
            maxDistance: targetConfig.controls.maxDistance,
            maxAzimuthAngle: targetConfig.controls.maxAzimuthAngle,
            minAzimuthAngle: targetConfig.controls.minAzimuthAngle || 0,
            duration: duration * 0.8, // Slightly faster for smoother feel
            onUpdate: () => {
              orbit.minDistance = currentConstraints.minDistance;
              orbit.maxDistance = currentConstraints.maxDistance;
              orbit.maxAzimuthAngle = currentConstraints.maxAzimuthAngle;
              orbit.minAzimuthAngle = currentConstraints.minAzimuthAngle;
            },
            onComplete: () => {
              // Set final control properties
              orbit.enableRotate = targetConfig.controls.enableRotate;
              if (targetConfig.controls.minAzimuthAngle === undefined) {
                orbit.minAzimuthAngle = undefined;
              }
            },
          },
          0.2
        ); // Start slightly later for smoother transition

        animationRef.current = tl;
      },
    }));

    // Cleanup animation on unmount
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
        enabled={freeClicked}
        enableDamping={freeClicked}
        enableZoom={freeClicked}
        enablePan={false}
        dampingFactor={0.05}
        minDistance={10}
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
  }
);

CameraControls.displayName = "CameraControls";
export default CameraControls;
