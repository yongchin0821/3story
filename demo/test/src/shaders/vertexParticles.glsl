uniform float uTime;
uniform float uSize;
uniform sampler2D uPositions;
varying vec2 vUv;
varying vec4 vColor;

void main() {
    vUv = uv;
    vec4 pos = texture2D(uPositions, vUv);

    float angle = atan(pos.y, pos.x);

    vColor = 0.7 * vec4(0.5 + 0.45 * sin(angle + uTime * 0.4));

    vec4 modelPosition = modelMatrix * vec4(pos.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_PointSize = 1. * (1.0 / -viewPosition.z);
    gl_Position = projectionPosition;
}