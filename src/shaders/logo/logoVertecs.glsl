// Removing redefinitions of built-in attributes and uniforms
// (position, normal, uv, modelViewMatrix, projectionMatrix, normalMatrix)
uniform float time;
uniform vec2 mousePos;
uniform float mouseRadius;
uniform float shatterIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

// Noise functions
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    
    vec4 b = a.xyzx + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    
    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Calculate distance from vertex to mouse in model space
    vec3 transformedPosition = position;
    vec3 positionToMouse = vec3(mousePos, 0.0) - transformedPosition.xyz;
    float distanceToMouse = length(positionToMouse);
    
    // Shatter effect intensity based on mouse proximity
    float effect = 0.0;
    if (distanceToMouse < mouseRadius) {
        // Calculate noise value for random displacement direction
        float noiseValue = noise(position * 5.0 + time * 0.2);
        
        // Calculate displacement factor
        float displacementFactor = (1.0 - distanceToMouse / mouseRadius) * shatterIntensity;
        
        // Apply directional displacement away from mouse
        vec3 direction = normalize(transformedPosition - vec3(mousePos, 0.0));
        transformedPosition += direction * displacementFactor * (0.5 + noiseValue * 0.5);
        
        // Store displacement for fragment shader
        effect = displacementFactor;
    }
    
    vDisplacement = effect;
    
    // Project the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
}