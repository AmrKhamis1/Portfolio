uniform vec3 outerColor;
uniform vec3 innerColor;
uniform float time;
uniform vec2 mousePos;
uniform float mouseRadius;
uniform float shatterIntensity;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;
in float vDisplacement;

out vec4 fragColor;

void main() {
    // Base reflection factor (simple lighting)
    float lightIntensity = max(0.0, dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))));
    float reflectionFactor = 0.2 + lightIntensity * 0.8;
    
    // Color blending based on displacement
    vec3 finalColor;
    
    if (vDisplacement > 0.0) {
        // Shattered area - reveal inner color and add edge effects
        float edgeFactor = smoothstep(0.0, 0.3, vDisplacement);
        
        // Create crack pattern near edges
        float crackPattern = fract(vDisplacement * 10.0 + sin(vUv.x * 20.0) * cos(vUv.y * 20.0));
        crackPattern = step(0.5, crackPattern);
        
        // Mix outer and inner colors with edge highlighting
        vec3 edgeColor = vec3(1.0, 0.9, 0.5); // Slightly golden edge highlight
        
        // Blend between outer and inner color based on displacement
        finalColor = mix(outerColor, innerColor, edgeFactor);
        
        // Add highlights to cracks and edges
        if (edgeFactor > 0.05 && edgeFactor < 0.8 && crackPattern > 0.5) {
            finalColor = mix(finalColor, edgeColor, 0.6);
        }
        
        // Add some variation based on normal and time for a subtle animated effect
        float timeFactor = sin(time * 2.0 + vPosition.x * 10.0) * 0.5 + 0.5;
        finalColor *= 0.9 + timeFactor * 0.2;
    } else {
        // Untouched area - show outer color
        finalColor = outerColor;
    }
    
    // Apply lighting
    finalColor *= reflectionFactor;
    
    // Use fragColor instead of gl_FragColor for GLSL3
    fragColor = vec4(finalColor, 1.0);
}