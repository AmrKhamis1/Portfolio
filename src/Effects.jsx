import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass>
        {/* Bloom Effect */}
        <Bloom
          mipmapBlur
          radius={0.5}
          threshold={0.1}
          luminanceSmoothing={0.0}
          intensity={0.06}
        />
      </EffectComposer>
    </>
  );
}
