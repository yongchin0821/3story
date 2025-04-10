uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
attribute float aScale;
varying vec2 vUv;
varying vec3 vUv2;

#include ./includes/simplexNoise3d.glsl

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    float noise = simplexNoise3d(vec3(uv,0.0));
    vUv = vec2(noise,noise);
    vUv2 = vec3(noise,noise,noise);
}