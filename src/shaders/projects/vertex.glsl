uniform float uPointSize;
uniform float uProgress;
uniform float uFreq;
// uniform float scale;


varying vec2 vTexCoords;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
attribute vec3 initPosition;

    void main() {
    //   vUv = position; 
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    // MVP
    vec4 modelViewPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
	gl_Position = projectedPosition;
    }