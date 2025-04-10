varying vec2 vUv;
varying vec3 vUv2;

void main()
{
    gl_FragColor = vec4(vUv2, 1.0); //设置到alpha上
}