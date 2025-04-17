uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0 - 2.0*f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vNormal = normal;
  vec3 pos = position;

  float dist = length(pos.xz); // distance from center
  float edgeFactor = smoothstep(1.0, 2.0, dist); // 0 near center, 1 near outer edge

  // Add wild distortion to outer edges
  float displacement = fbm(pos.xz * 2.5 + uTime * 0.3) * edgeFactor * 0.6;

  // Twist the edges outward for chaotic effect
  float swirl = fbm(pos.xy + uTime * 0.2) * 3.14;
  pos.xz += vec2(cos(swirl), sin(swirl)) * edgeFactor * 0.3;

  // Vertical rise distortion
  pos.y += fbm(pos.xz * 2.0 + uTime * 0.4) * edgeFactor * 0.1;

  pos += normal * displacement;

  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
