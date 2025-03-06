import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// List of words
const words = [
  "React.js",
  "Vite.js",
  "Three.js",
  "GLSL",
  "Gsap",
  "Node.js",
  "Express.js",
  "Networking",
  "CISCO",
  "IOT",
  "3D Modeling",
  "Blender",
  "MySQL",
  "Linux",
  "C++",
  "PHP",
  "C#",
  "Python",
  "Debugging",
  "Testing",
  "Problem-Solving",
  "Hooks",
  "Fetch",
  "Programming",
  "Graphic Design",
  "Photoshop",
  "AfterEffects",
  "Full-Stack",
  "Front-End",
  "Back-End",
  "Docker",
];

const WordCylinderScene = ({ hoverEffect }) => {
  const groupRef = useRef();
  const wordRefs = useRef([]);

  // Store target positions for smooth transition
  const [targetPositions, setTargetPositions] = useState([]);

  useFrame(() => {
    if (groupRef.current) {
      // groupRef.current.rotation.y += 0.001;
    }

    // Smoothly interpolate positions
    wordRefs.current.forEach((textMesh, index) => {
      if (textMesh && targetPositions[index]) {
        textMesh.position.lerp(targetPositions[index], 0.01); // Smooth transition
      }
    });
  });

  // Update target positions when hoverEffect changes
  useMemo(() => {
    const newPositions = words.map((word, index) => {
      const angle = (index / words.length) * Math.PI * 2;
      const radius = 8;
      const height = 25;

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
    <group ref={groupRef} position={[-8, 15, -90]}>
      {words.map((word, index) => (
        <Text
          key={index}
          ref={(el) => (wordRefs.current[index] = el)}
          position={[0, 0, 0]} // Start from (0,0,0), will animate to the correct position
          fontSize={0.4}
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
