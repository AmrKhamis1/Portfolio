uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
#define PI 3.141592653589793238462643383279502884197
float circle(vec2 uv, float border) {
    float radius = 0.5;
    float dist = radius - distance(uv, vec2(0.5, 0.5));
    return smoothstep(0.0, border, dist);
}
float smoothMod(float axis,float amp,float rad){
    float top = cos(PI*(axis/amp))* sin(PI*(axis/amp));
    float bottom = pow(sin(PI*(axis/amp)),2.0)+pow(rad,2.0);
    float at = atan(top/bottom);
    return amp * (1.0/2.0)- (1.0/PI)*at;
}

void main() {

// gl_FragColor.a*= circle(gl_PointCoord,0.2);
// gl_FragColor.a*= uProgress;
	vec2 uv = vUv;
    uv.y += uTime*10.0;
gl_FragColor = vec4(vec3(smoothMod(uv.y*20.0,1.0,1.0)), 1);
}
