uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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
  float frequency = 20.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec3 glowColor = vec3(0.0, 0.5, 0.9); // inner aqua
  vec3 smokeColor = vec3(0.0, 0.0, 0.2); // pure black

  float dist = length(vPosition.xz); // from center

  float inwardness = dot(normalize(vNormal), normalize(-vPosition));
  float glow = smoothstep(0.5, 1.0, inwardness) * smoothstep(0.1, 1.9, dist);

  float smoke = fbm(vPosition.xz * 1.5 + uTime * 0.2);
  smoke = smoothstep(0.4, 0.8, smoke);

  float outerFade = smoothstep(1.0, 2.0, dist); // fade to black

  float alpha = mix(smoke, 1.0, glow) * (1.0 - outerFade);
  alpha = pow(alpha, 1.8); // smooth alpha

  vec3 finalColor = mix(smokeColor, glowColor, glow);
  gl_FragColor = vec4(finalColor, alpha);
}
