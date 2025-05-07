// SceneRenderer.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";

export default function SceneRenderer({ onTextureReady }) {
  const fbo = useFBO();
  const { gl, scene, camera } = useThree();

  useFrame(() => {
    gl.setRenderTarget(fbo);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    if (onTextureReady) onTextureReady(fbo.texture);
  });

  return null;
}
