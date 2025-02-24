precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    //增加阴影效果
    textureColor.rgb *= vElevation * 2.0 + 0.6;
    gl_FragColor = textureColor;
}