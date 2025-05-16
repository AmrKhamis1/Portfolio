import { useState, useEffect } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { FisheyeEffect } from "./MouseDistortionPass";
import { Resolution } from "postprocessing";
export default function Effects() {
  // State to track if the device is a touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Function to detect touch device
    const detectTouchDevice = () => {
      // Check for touch capabilities
      const hasTouchSupport =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

      setIsTouchDevice(hasTouchSupport);
    };

    // Detect touch device on initial render
    detectTouchDevice();

    // Optional: Also listen for resize events in case of device orientation changes
    window.addEventListener("resize", detectTouchDevice);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", detectTouchDevice);
    };
  }, []);

  // If it's a touch device, return without the effect
  if (isTouchDevice) {
    return (
      <>
        <EffectComposer disableNormalPass multisampling={0}>
          {/* No FisheyeEffect for touch devices */}
        </EffectComposer>
      </>
    );
  }

  // For non-touch devices, include the FisheyeEffect
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        <FisheyeEffect />
        <Bloom
          luminanceSmoothing={0.125}
          intensity={0.01}
          radius={1}
          luminanceThreshold={10.9}
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        ></Bloom>
      </EffectComposer>
    </>
  );
}
