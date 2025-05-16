uniform sampler2D uPositions;
uniform sampler2D uInfo;
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;

#include ./noise.glsl

//mesh
void main() {
    vec4 pos = texture2D(uPositions, vUv);
    vec4 info = texture2D(uInfo, vUv);

    vec2 mouse = uMouse;

    float radius = length(pos.xy);

    float circlularForce = 1. - smoothstep(0.3, 1.4, abs(pos.x - radius));
    //info.y代表速度，-info.y代表给一个随机的速度，后面的0.25大小可以改变环形粗细
    float angle = atan(pos.y, pos.x) - info.y * 0.25 * mix(0.3, 1., circlularForce);

    float targetRadius = mix(info.x, 1.8, 1.);
    //更加扭曲，暂时频闭
    // float targetRadius = mix(info.x, 1.8, 0.5 + 0.45 * sin(angle * 2. + uTime * 0.2));

    //半径校正
    radius += (targetRadius - radius) * mix(0.2, 0.5, circlularForce);

    vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;

    pos.xy += (targetPos.xy - pos.xy) * 0.1;

    //noise
    pos.xy += curl(pos.xyz * 4., uTime * 0.1, 0.1).xy * 0.005;

    float dist = length(pos.xy - mouse);
    vec2 dir = normalize(pos.xy - mouse);
    pos.xy += dir * 0.1 * smoothstep(0.4, 0., dist);

    gl_FragColor = vec4(pos.xy, 1., 1.);
}
