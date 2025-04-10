void main()
{
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5, 0.5)); //计算点到中心的距离，中心是(0.5,0.5)
    float strenth = (0.1/distanceToCenter)-0.2; //计算出来距离区间在(0,0.5)之间，整理用个0.05/x -0.1 的数学函数，x越小值越大，这样中心就最亮了
    gl_FragColor = vec4(1.0,1.0,1.0,strenth); //设置到alpha上
}