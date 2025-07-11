uniform sampler2D tDiffuse;
uniform sampler2D tPrev;
uniform vec4 resolution;
varying vec2 vUv;

//mesh
void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 prev = texture2D(tPrev, vUv);
    gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = color + prev * 0.9;
    //  gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0); // 红色
}
