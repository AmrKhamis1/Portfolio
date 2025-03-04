import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          radius={0.5}
          luminanceSmoothing={0.0}
          intensity={0.5}
        ></Bloom>
        {/* <Vignette
          offset={0.5} // vignette offset
          darkness={0.5} // vignette darkness
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        /> */}
      </EffectComposer>
    </>
  );
}
