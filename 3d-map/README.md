好的，接下来我需要实现一个动画效果，你先阅读我编写的代码，在我的代码的基础上进行动画实现

## Role:
You are an expert in software page design and development.

## Skills:
- react thress fiber
- 优秀的设计能力，UX/UI 极致
- 
## Objective:
1. 实现一个动画
2. 动画的效果是随机选择一个地区进行glb模型的展示、放大及移动
3. 动画开始到结束期间算作一个动画循环
4. 动画循环之间间隔3秒

## Animation describtion
1.动画循环总长3秒
2.动画前两秒，模型Light从地区上出现，逐渐放大已经向上移动
3.动画最后一秒，停止移动，模型Light逐渐消失


我按照你的建议修改了代码，通过打印lightRef发现{current:undefined}

## console error
Scene.tsx?t=1740582204248:148 Uncaught TypeError: Cannot read properties of undefined (reading 'position')
    at startAnimation (Scene.tsx?t=1740582204248:148:11)
    at Scene.tsx?t=1740582204248:180:5


## codes
```Scene.tsx
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import * as THREE from "three";
import Light from "./compoentes/Light";
import gsap from "gsap";

interface Feature {
  type: string;
  properties: { name: string }; // 明确指定 name 字段
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][]; // 支持 Polygon 和 MultiPolygon
  };
}

const MapShape = ({ feature }: { feature: Feature }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // 将 GeoJSON 坐标转换为 THREE.js Shape
  const shapes: THREE.Shape[] = [];
  const coordinates =
    feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates];

  coordinates.forEach((polygon) => {
    polygon.forEach((ring) => {
      const shape = new THREE.Shape();
      ring.forEach(([lng, lat], i) => {
        const x = lng - 110; // 缩放 10 倍，中心经度 110
        const y = lat - 35; // 缩放 10 倍，中心纬度 35
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      shapes.push(shape);
    });
  });

  // 创建边界线的几何体
  const extrudeSettings = { depth: hovered ? 1.5 : 1, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
  const edges = new THREE.EdgesGeometry(geometry);

  useFrame(() => {
    // 可选：动态缩放效果
    // if (meshRef.current) meshRef.current.scale.z = hovered ? 1.2 : 1;
  });

  return (
    <group>
      {/* 区域主体 */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => {
          setHovered(true);
          console.log("Region:", feature.properties.name);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#ff6b6b" : "#ffffff"}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>

      {/* 边界线 */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
    </group>
  );
};

const ChinaMap = ({ geoData }: { geoData: Feature[] }) => {
  return (
    <group>
      {geoData.map((feature, index) => (
        <MapShape key={index} feature={feature} />
      ))}
    </group>
  );
};

const Scene = () => {
  const [geoData, setGeoData] = useState<Feature[]>([]);

  // 从网页获取 GeoJSON 数据
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGeoData(data.features); // 设置获取到的 features 数据
      } catch (error) {
        console.error("Failed to fetch GeoJSON:", error);
      }
    };

    fetchGeoJSON();
  }, []); // 空的依赖数组，确保只在组件挂载时请求一次

  const lightRef = useRef();
  const startAnimation = () => {
    const randomIndex = Math.floor(Math.random() * geoData.length);
    const region = geoData[randomIndex];
    console.log(region);
    const centroid = region.properties.centroid || [0, 0]; // 假设有中心点数据
    const x = centroid[0];
    const y = centroid[1];

    // 重置 Light 初始状态
    const light = lightRef.current;
    console.log(lightRef);
    light.position.set(x, y, 0);
    light.scale.setScalar(0);
    light.material.opacity = 1;

    // 创建 GSAP 时间线
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(startAnimation, 3000); // 3秒后重复
      },
    });

    // 动画阶段 1：前 2 秒放大并移动
    tl.to(light.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: "power2.out",
    }).to(
      light.position,
      {
        z: 10,
        duration: 2,
        ease: "power2.out",
      },
      "<" // 与 scale 动画同时开始
    );

    // 动画阶段 2：最后 1 秒渐隐
    tl.to(light.material, {
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    });
  };

  useEffect(() => {
    if (!geoData || geoData.length === 0) return;
    startAnimation();
    // 首次启动
  }, [geoData]);

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
      {/* 灯光 */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />

      {/* 地图主体 */}
      <Center>
        {geoData.length > 0 ? (
          <>
            <ChinaMap geoData={geoData} />
            <axesHelper args={[5]} />
          </>
        ) : (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        )}
      </Center>
      <group scale={5}>
        <Light
          ref={lightRef}
          position-z={2}
          rotation={[0, Math.PI * 0.5, Math.PI * 0.2]}
        />
      </group>
      {/* 交互控制 */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      <axesHelper args={[5]} />
    </Canvas>
  );
};

export default Scene;
        
```

```Light.tsx
import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Model = forwardRef((props, ref) => {
    const { nodes, materials } = useGLTF("/light.glb");
    console.log(materials);
  const material =
    materials["tripo_material_1bd8f693-3395-4993-a106-1f135c20a476"].clone();
  material.transparent = true;
  material.opacity = 1;

  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={
          nodes["tripo_node_1bd8f693-3395-4993-a106-1f135c20a476"].geometry
        }
        material={material}
      />
    </group>
  );
});

useGLTF.preload("/light.glb");

export default Model;

```
