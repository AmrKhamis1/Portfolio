import { forwardRef, useMemo, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Uniform, Vector2 } from "three";
import { Effect } from "postprocessing";

// GLSL fragment shader: applies a fisheye lens effect near the mouse with white border
const fragmentShader = `
uniform vec2 e0Mouse; // normalized 0..1 range
uniform vec2 e0Resolution;
uniform float e0Time;
uniform float e0AspectRatio; // aspect ratio uniform

void mainUv(inout vec2 uv) {
  // Apply aspect ratio correction for perfect circles
  vec2 aspectCorrectedUV = uv;
  aspectCorrectedUV.x *= e0AspectRatio;
 
  vec2 aspectCorrectedMouse = e0Mouse;
  aspectCorrectedMouse.x *= e0AspectRatio;
 
  // Calculate distance in the corrected space
  float dist = distance(aspectCorrectedUV, aspectCorrectedMouse);
 
  // Circle parameters
  float radius = 1.2; // Size of the entire circle
  float innerRadius = radius * 0.7; // Inner circle with no effect
  
  // Check if we're in the black hole effect area (outer ring only)
  if (dist < radius && dist > innerRadius) {
    // Calculate how far we are into the effect ring (0 at inner edge, 1 at outer edge)
    float ringProgress = (dist - innerRadius) / (radius - innerRadius);
    
    // Direction from current point to mouse center (reversed for black hole effect)
    vec2 direction = normalize(aspectCorrectedMouse - aspectCorrectedUV);
    
    // Spiral rotation effect in the outer ring
    float rotationSpeed = 0.5;
    float rotationStrength = 0.5; // How much rotation influences the direction
    float angle = atan(direction.y, direction.x) + e0Time * rotationSpeed;
    vec2 rotationDirection = vec2(cos(angle), sin(angle));
    
    // Blend between direct pull and rotation based on ring position
    direction = mix(direction, rotationDirection, rotationStrength);
    
    // Pull strength increases as we move toward the outer edge
    float pullStrength = 1.7 * pow(ringProgress, 1.5); // Adjusted curve for stronger effect
    
    // Calculate distortion amount
    float displacement = radius * pullStrength * 0.4; // Reduced overall strength for subtlety
    
    // Apply gravitational distortion
    vec2 newAspectPos = aspectCorrectedUV + direction * displacement;
    
    // Convert back to original UV space
    newAspectPos.x /= e0AspectRatio;
    
    // Update the UV coordinates
    uv = newAspectPos;
  }
  // If inside innerRadius, do nothing - keep original coordinates
}

// Fragment shader function without border
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Normal color from the modified UVs
  outputColor = inputColor;
}
`;

// Custom Effect implementation
class FisheyeEffectImpl extends Effect {
  constructor() {
    super("FisheyeEffect", fragmentShader, {
      uniforms: new Map([
        ["e0Time", new Uniform(0.0)],
        ["e0Resolution", new Uniform(new Vector2(1, 1))],
        ["e0Mouse", new Uniform(new Vector2(0.5, 0.5))],
        ["e0AspectRatio", new Uniform(1.0)], // Add aspect ratio uniform
      ]),
    });
  }
}

// React component wrapping the effect
export const FisheyeEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new FisheyeEffectImpl(), []);
  const { gl, size } = useThree();
  const effectRef = useRef(effect);
  effectRef.current = effect;
  const mouse = useRef(new Vector2(0.5, 0.5));

  useEffect(() => {
    const handleMouseMove = (event) => {
      const bounds = gl.domElement.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      // mouse.current.set(x, 1.0 - y); // flip Y for UV coords
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gl]);

  // Update uniforms every frame
  useFrame((state, delta) => {
    // Update time (seconds)
    effect.uniforms.get("e0Time").value += delta;
    effect.uniforms.get("e0Resolution").value.set(size.width, size.height);
    effect.uniforms.get("e0Mouse").value.copy(mouse.current);
    // Calculate and update aspect ratio
    const aspectRatio = size.width / size.height;
    effect.uniforms.get("e0AspectRatio").value = aspectRatio;
    if (props.debug) {
      console.log("Mouse:", mouse.current, "Aspect Ratio:", aspectRatio);
    }
  });

  return <primitive ref={ref} object={effect} dispose={null} {...props} />;
});
