import { useState, useEffect, useMemo } from "react";
import {
  EffectComposer,
  Bloom,
  SMAA,
  ToneMapping,
} from "@react-three/postprocessing";
import { FisheyeEffect } from "./MouseDistortionPass";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // touch detection function
  const detectTouchDevice = useMemo(() => {
    return () => {
      const hasTouchSupport =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

      setIsTouchDevice(hasTouchSupport);
    };
  }, []);

  // touch device detection
  useEffect(() => {
    // Initial detection
    detectTouchDevice();

    // resize events
    window.addEventListener("resize", detectTouchDevice, { passive: true });

    return () => {
      window.removeEventListener("resize", detectTouchDevice);
    };
  }, [detectTouchDevice]);

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
      {!isTouchDevice && <FisheyeEffect />}

      <ToneMapping
        blendFunction={effectConfig.toneMapping.blendFunction}
        adaptive={effectConfig.toneMapping.adaptive}
        resolution={effectConfig.toneMapping.resolution}
        middleGrey={effectConfig.toneMapping.middleGrey}
        maxLuminance={effectConfig.toneMapping.maxLuminance}
        averageLuminance={effectConfig.toneMapping.averageLuminance}
        adaptationRate={effectConfig.toneMapping.adaptationRate}
      />

      <SMAA />

      <Bloom
        intensity={effectConfig.bloom.intensity}
        radius={effectConfig.bloom.radius}
        mipmapBlur={effectConfig.bloom.mipmapBlur}
      />
    </EffectComposer>
  );
}
