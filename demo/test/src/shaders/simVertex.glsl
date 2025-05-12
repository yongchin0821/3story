uniform float time;
uniform float uSize;
varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_PointSize = 10. * (1.0 / -viewPosition.z);

    // vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // gl_PointSize = 1000. * (1.0 / -mvPosition.z);
    gl_Position = projectionPosition;
}