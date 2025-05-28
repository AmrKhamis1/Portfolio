import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { useRef, useCallback } from "react";

export default function SceneRenderer({ onTextureReady }) {
  const fbo = useFBO();
  const { gl, scene, camera } = useThree();

  const lastTextureRef = useRef(null);

  const handleTextureReady = useCallback(
    (texture) => {
      if (lastTextureRef.current !== texture && onTextureReady) {
        lastTextureRef.current = texture;
        onTextureReady(texture);
      }
    },
    [onTextureReady]
  );

  useFrame(() => {
    gl.setRenderTarget(fbo);

    gl.render(scene, camera);

    gl.setRenderTarget(null);

    handleTextureReady(fbo.texture);
  });

  return null;
}
