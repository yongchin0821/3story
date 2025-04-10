uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime+modelPosition.x*100.0)*aScale*0.02; //乘以一个大小因子，这样大的粒子移动幅度大，小的不怎么移动
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize*aScale*uPixelRatio;
    gl_PointSize *= (1.0/-viewPosition.z); //固定公式：可以使例子大小随机
}