import { forwardRef, useMemo, useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Uniform, Vector2 } from "three";
import { Effect } from "postprocessing";

// GLSL fragment shader for fisheye effect
const fragmentShader = `
uniform vec2 e0Mouse;
uniform vec2 e0Resolution;
uniform float e0Time;
uniform float e0AspectRatio;

void mainUv(inout vec2 uv) {
  // Apply aspect ratio correction for perfect circles
  vec2 aspectCorrectedUV = uv;
  aspectCorrectedUV.x *= e0AspectRatio;
 
  vec2 aspectCorrectedMouse = e0Mouse;
  aspectCorrectedMouse.x *= e0AspectRatio;
 
  // Calculate distance in the corrected space
  float dist = distance(aspectCorrectedUV, aspectCorrectedMouse);
 
  // Circle parameters
  float radius = 1.2;
  float innerRadius = radius * 0.7;
  
  // Check if we're in the effect area (outer ring only)
  if (dist < radius && dist > innerRadius) {
    // Calculate ring progress (0 at inner edge, 1 at outer edge)
    float ringProgress = (dist - innerRadius) / (radius - innerRadius);
    
    // Direction from current point to mouse center
    vec2 direction = normalize(aspectCorrectedMouse - aspectCorrectedUV);
    
    // Spiral rotation effect
    float rotationSpeed = 0.5;
    float rotationStrength = 0.5;
    float angle = atan(direction.y, direction.x) + e0Time * rotationSpeed;
    vec2 rotationDirection = vec2(cos(angle), sin(angle));
    
    // Blend between direct pull and rotation
    direction = mix(direction, rotationDirection, rotationStrength);
    
    // Pull strength increases toward outer edge
    float pullStrength = 1.7 * pow(ringProgress, 1.5);
    
    // Calculate distortion amount
    float displacement = radius * pullStrength * 0.4;
    
    // Apply gravitational distortion
    vec2 newAspectPos = aspectCorrectedUV + direction * displacement;
    
    // Convert back to original UV space
    newAspectPos.x /= e0AspectRatio;
    
    // Update UV coordinates
    uv = newAspectPos;
  }
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
}
`;

// Custom Effect implementation - memoized to prevent recreation
class FisheyeEffectImpl extends Effect {
  constructor() {
    super("FisheyeEffect", fragmentShader, {
      uniforms: new Map([
        ["e0Time", new Uniform(0.0)],
        ["e0Resolution", new Uniform(new Vector2(1, 1))],
        ["e0Mouse", new Uniform(new Vector2(0.5, 0.5))],
        ["e0AspectRatio", new Uniform(1.0)],
      ]),
    });
  }
}

// React component wrapping the effect
export const FisheyeEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new FisheyeEffectImpl(), []);
  const { gl, size } = useThree();
  const mouse = useRef(new Vector2(0.5, 0.5));

  // Store effect reference to avoid recreation
  const effectRef = useRef(effect);
  effectRef.current = effect;

  // Memoized mouse handler to prevent recreation
  const handleMouseMove = useCallback(
    (event) => {
      const bounds = gl.domElement.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      // Update mouse position (commented out the original update)
      // mouse.current.set(x, 1.0 - y);
    },
    [gl.domElement]
  );

  // Mouse event listener setup
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Frame update with optimized uniform updates
  useFrame((state, delta) => {
    const uniforms = effect.uniforms;

    // Update time
    uniforms.get("e0Time").value += delta;

    // Update resolution if changed
    const resolution = uniforms.get("e0Resolution").value;
    if (resolution.x !== size.width || resolution.y !== size.height) {
      resolution.set(size.width, size.height);
    }

    // Update mouse position
    uniforms.get("e0Mouse").value.copy(mouse.current);

    // Update aspect ratio
    const aspectRatio = size.width / size.height;
    uniforms.get("e0AspectRatio").value = aspectRatio;

    // Debug logging (only if debug is enabled)
    if (props.debug) {
      console.log(
        "Mouse:",
        mouse.current.toArray(),
        "Aspect Ratio:",
        aspectRatio
      );
    }
  });

  return <primitive ref={ref} object={effect} dispose={null} {...props} />;
});
