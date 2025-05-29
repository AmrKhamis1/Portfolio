import { useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Sepia,
  Noise,
  ColorAverage,
} from "@react-three/postprocessing";
import { FisheyeEffect } from "./MouseDistortionPass";
import { BlendFunction } from "postprocessing";

const Effects = forwardRef((props, ref) => {
  const fisheyeEffectRef = useRef(null);

  // Expose the fisheye effect to parent component
  useImperativeHandle(ref, () => ({
    fisheyeEffect: fisheyeEffectRef.current,
  }));

  // effect configuration
  const effectConfig = useMemo(
    () => ({
      // ToneMapping settings
      toneMapping: {
        blendFunction: BlendFunction.AVERAGE,
        adaptive: false,
        resolution: 256,
        middleGrey: 0.6,
        maxLuminance: 16.0,
        averageLuminance: 1.0,
        adaptationRate: 1.0,
      },
      // Bloom settings
      bloom: {
        intensity: 0.05,
        radius: 0.5,
        mipmapBlur: true,
      },
    }),
    []
  );

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <FisheyeEffect ref={fisheyeEffectRef} />
      <ToneMapping
        blendFunction={effectConfig.toneMapping.blendFunction}
        adaptive={effectConfig.toneMapping.adaptive}
        resolution={effectConfig.toneMapping.resolution}
        middleGrey={effectConfig.toneMapping.middleGrey}
        maxLuminance={effectConfig.toneMapping.maxLuminance}
        averageLuminance={effectConfig.toneMapping.averageLuminance}
        adaptationRate={effectConfig.toneMapping.adaptationRate}
      />
      {props.showWorld && (
        <>
          <ColorAverage
            blendFunction={BlendFunction.NORMAL} // blend mode
          />

          <Sepia intensity={3}></Sepia>

          <Noise
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.NORMAL} // blend mode
          ></Noise>
        </>
      )}
      <Bloom
        intensity={effectConfig.bloom.intensity}
        radius={effectConfig.bloom.radius}
        mipmapBlur={effectConfig.bloom.mipmapBlur}
      />
    </EffectComposer>
  );
});

export default Effects;
