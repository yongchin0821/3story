uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;


#include ./includes/perlinNoise.glsl

void main()
{
    // 替换uv
    vec2 displacedUv = vUv + cnoise(vec3(vUv*3.0, uTime*0.2));

    // 添加噪声
    float strenth = cnoise(vec3(displacedUv*3.0, uTime*0.2));

    // 外发光
    // strenth += distance(vUv, vec2(0.5))*5.0-1.4;

    // 锐利化
    // strenth += step(-0.2, strenth)*0.8;

    // 限制在0-1之间
    // strenth=clamp(strenth, 0.0,1.0);

    vec3 color = mix(uColorStart, uColorEnd, strenth);
    // float strenth = cnoise(vec3(vUv*5.0, uTime));
    gl_FragColor = vec4(color, 1.0); //设置到alpha上
}