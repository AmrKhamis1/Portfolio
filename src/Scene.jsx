import { useContext, useRef, useEffect } from "react";
import { ScrollContext } from "./main";
import { useFrame, useThree, extend } from "@react-three/fiber";

export default function EnhancedScene() {
  const scrollValue = useContext(ScrollContext);
  const cameraRef = useRef();

  useFrame(() => {
    if (!cameraRef.current) return;

    const scrollDepth = Math.min(scrollValue / 1000, 4); 

  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 10]} intensity={20} color="#ffffff" />
    </>
  );
}

// Import for logo (assuming you're using drei's useGLTF)
