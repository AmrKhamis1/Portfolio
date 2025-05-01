import {
  EffectComposer,
  Bloom,
  DepthOfField,
  HueSaturation,
  ToneMapping,
  Vignette,
  Grid,
  Glitch,
  DotScreen,
  ColorAverage,
  ChromaticAberration,
  BrightnessContrast,
  SMAA,
  SSAO,
  Sepia,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        {/* Bloom Effect */}
        {/* <Bloom
          mipmapBlur
          radius={0.1}
          threshold={0.1}
          luminanceSmoothing={0.0}
          intensity={0.04}
        /> */}
        {/* <DepthOfField
          focusDistance={0} // where to focus
          focalLength={0.02} // focal length
          bokehScale={1} // bokeh size
        /> */}
        {/* <HueSaturation
          blendFunction={BlendFunction.MULTIPLY} // blend mode
          hue={1.6} // hue in radians
          saturation={1} // saturation in radians
        /> */}
        {/* <ToneMapping
          blendFunction={BlendFunction.HUE} // blend mode
          adaptive={true} // toggle adaptive luminance map usage
          resolution={1256} // texture resolution of the luminance map
          middleGrey={0.6} // middle grey factor
          maxLuminance={16.0} // maximum luminance
          averageLuminance={1.0} // average luminance
          adaptationRate={1.0} // luminance adaptation rate
        /> */}
        {/* <Vignette
          offset={0.6} // vignette offset
          darkness={0.4} // vignette darkness
          eskil={false} // Eskil's vignette technique
          blendFunction={BlendFunction.NORMAL} // blend mode
        /> */}
        {/* <Grid
          blendFunction={BlendFunction.PIN_LIGHT} // blend mode
          scale={0.015} // grid pattern scale
          lineWidth={1} // grid pattern line width
          size={{ width: 50, height: 50 }} // overrides the default pass width and height
        /> */}
        {/* <Glitch
          delay={[1.5, 3.5]} // min and max glitch delay
          duration={[0.6, 1.0]} // min and max glitch duration
          strength={[0.9, 1.3]} // min and max glitch strength
          mode={GlitchMode.CONSTANT_MILD} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.0} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        /> */}
        {/* <DotScreen
          blendFunction={BlendFunction.SATURATION} // blend mode
          angle={Math.PI * 0.5} // angle of the dot pattern
          scale={1.0} // scale of the dot pattern
        /> */}

        {/* <ColorAverage
          blendFunction={BlendFunction.SCREEN} // blend mode
        /> */}
        {/* <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.0005, 0.0005]} // color offset
        /> */}
        {/* <BrightnessContrast
          brightness={-0.1} // brightness. min: -1, max: 1
          contrast={-0.2} // contrast: min -1, max: 1
        /> */}
        <SMAA />
        {/* <Sepia
          intensity={0.5} // sepia intensity
          blendFunction={BlendFunction.NORMAL} // blend mode
        /> */}
        {/* <SSAO
          blendFunction={BlendFunction.NORMAL} // blend mode
          samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={4} // amount of rings in the occlusion sampling pattern
          distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          distanceFalloff={0.0} // distance falloff. min: 0, max: 1
          rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
          radius={20} // occlusion sampling radius
          scale={1.5} // scale of the ambient occlusion
          bias={1.5} // occlusion bias
        /> */}
      </EffectComposer>
    </>
  );
}
