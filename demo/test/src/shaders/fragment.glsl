uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;
varying vec4 vColor;

//mesh
void main() {
    // gl_FragColor = vec4(1.0, 1.,1.0, 1.);
    gl_FragColor = vColor;
}
