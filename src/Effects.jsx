import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          radius={0.5}
          threshold={0.1}
          luminanceSmoothing={0.0}
          intensity={0.06}
        ></Bloom>
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
