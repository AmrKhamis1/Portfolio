import { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Uniform, Vector2 } from "three";
import { Effect } from "postprocessing";

// shader
const fragmentShader = `
uniform vec2 e0Resolution;
uniform float e0Time;
uniform float eRadius;
uniform float e0AspectRatio;

void mainUv(inout vec2 uv) {
  vec2 aspectCorrectedUV = uv;
  aspectCorrectedUV.x *= e0AspectRatio;

  vec2 center = vec2(0.5 * e0AspectRatio, 0.5);
  float dist = distance(aspectCorrectedUV, center);

  float outerRadius = 1.2;
  float innerRadius = outerRadius * eRadius;

  if (dist < outerRadius && dist > innerRadius) {
    float ringProgress = (dist - innerRadius) / (outerRadius - innerRadius);
    vec2 direction = normalize(center - aspectCorrectedUV);

    float rotationSpeed = 0.5;
    float rotationStrength = 0.5;
    float angle = atan(direction.y, direction.x) + e0Time * rotationSpeed;
    vec2 rotationDirection = vec2(cos(angle), sin(angle));

    direction = mix(direction, rotationDirection, rotationStrength);

    float pullStrength = 1.5 * pow(ringProgress, 1.5);
    float displacement = outerRadius * pullStrength*1.5;

    vec2 newAspectPos = aspectCorrectedUV + direction * displacement;

    newAspectPos.x /= e0AspectRatio;
    uv = clamp(newAspectPos, 0.0, 0.8); // clamp to screen
  }
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
}
`;

class FisheyeEffectImpl extends Effect {
  constructor() {
    super("FisheyeEffect", fragmentShader, {
      uniforms: new Map([
        ["e0Time", new Uniform(0.0)],
        ["e0Resolution", new Uniform(new Vector2(1, 1))],
        ["e0AspectRatio", new Uniform(1.0)],
        ["eRadius", new Uniform(2)],
      ]),
    });
  }
}

export const FisheyeEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new FisheyeEffectImpl(), []);
  const { size } = useThree();
  const effectRef = useRef(effect);

  useImperativeHandle(ref, () => ({
    uniforms: effect.uniforms,
    effect: effect,
  }));

  useFrame((state, delta) => {
    const uniforms = effect.uniforms;
    uniforms.get("e0Time").value += delta;

    const resolution = uniforms.get("e0Resolution").value;
    if (resolution.x !== size.width || resolution.y !== size.height) {
      resolution.set(size.width, size.height);
    }

    uniforms.get("e0AspectRatio").value = size.width / size.height;
  });

  return <primitive ref={ref} object={effect} dispose={null} {...props} />;
});
