import { EffectComposer, Bloom, SSR } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          radius={0.6}
          luminanceSmoothing={0.0}
          intensity={0.2}
        ></Bloom>
      </EffectComposer>
    </>
  );
}
