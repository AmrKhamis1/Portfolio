uniform sampler2D uScene;   // The scene texture
uniform vec2 uMouse;        // Normalized mouse position (0 to 1)
uniform float uRadius;      // Lens radius
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Distance from the mouse
  float dist = distance(uv, uMouse);

  // Only apply effect inside the circle
  if (dist < uRadius) {
    float strength = (uRadius - dist) / uRadius;

    // Melt/wave distortion
    float wave = sin((uv.y + uTime * 2.0) * 20.0) * 0.02 * strength;
    uv.x += wave;

    float waveY = cos((uv.x + uTime * 2.0) * 20.0) * 0.02 * strength;
    uv.y += waveY;
  }

  gl_FragColor = texture2D(uScene, uv);
}
