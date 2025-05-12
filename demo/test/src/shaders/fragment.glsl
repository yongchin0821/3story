uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;

//mesh
void main() {
    gl_FragColor = vec4(vUv, 0.0, 1.0);
}
