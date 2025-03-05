import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// List of words
const words = [
  "react.js",
  "vite.js",
  "three.js",
  "glsl",
  "gsap",
  "node.js",
  "express.js",
  "networking",
  "cisco",
  "iot",
  "3d modeling",
  "blender",
  "MySQL",
  "Linux",
  "c++",
  "php",
  "c#",
  "python",
  "debugging",
  "testing",
  "problem solving",
  "hooks",
  "fetch",
  "programming",
  "graphic design",
  "photoshop",
  "aftereffects",
  "full stack",
  "frontend",
  "backend",
  "docker",
];

const WordCylinderScene = ({ hoverEffect }) => {
  const groupRef = useRef();
  const wordRefs = useRef([]);

  // Store target positions for smooth transition
  const [targetPositions, setTargetPositions] = useState([]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }

    // Smoothly interpolate positions
    wordRefs.current.forEach((textMesh, index) => {
      if (textMesh && targetPositions[index]) {
        textMesh.position.lerp(targetPositions[index], 0.05); // Smooth transition
      }
    });
  });

  // Update target positions when hoverEffect changes
  useMemo(() => {
    const newPositions = words.map((word, index) => {
      const angle = (index / words.length) * Math.PI * 2;
      const radius = 6;
      const height = 10;

      if (hoverEffect) {
        // Sphere effect
        const phi = Math.acos(-1 + (2 * index) / words.length);
        const theta = Math.sqrt(words.length * Math.PI) * phi;
        return new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
          Math.cos(phi) * radius
        );
      } else {
        // Cylinder effect
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          (index / words.length - 0.5) * height,
          Math.sin(angle) * radius
        );
      }
    });

    setTargetPositions(newPositions);
  }, [hoverEffect]);

  return (
    <group ref={groupRef} position={[-8, 9, -90]}>
      {words.map((word, index) => (
        <Text
          key={index}
          ref={(el) => (wordRefs.current[index] = el)}
          position={[0, 0, 0]} // Start from (0,0,0), will animate to the correct position
          fontSize={0.6}
          color={[2, 4, 4]}
          anchorX="center"
          anchorY="middle"
        >
          {word}
        </Text>
      ))}
    </group>
  );
};

export default WordCylinderScene;
