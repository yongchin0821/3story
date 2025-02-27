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
    console.log("Light component mounted");
  }, []); // 空的依赖数组，确保只在组件挂载时请求一次

  const lightRef = useRef<THREE.Group>(null);
  const startAnimation = () => {
    if (!lightRef.current) {
      console.error("lightRef.current is undefined");
      return;
    }
    const randomIndex = Math.floor(Math.random() * geoData.length);
    const region = geoData[randomIndex];
    // console.log(region);
    const centroid = region.properties.center || [0, 0]; // 假设有中心点数据
    const x = centroid[0] - 110;
    const y = centroid[1] - 35;

    // 重置 Light 初始状态
    const light = lightRef.current;
    // console.log(lightRef);
    light.position.set(x, y, 0);
    light.scale.setScalar(1);
    light.children[0].material.opacity = 1;

    // 创建 GSAP 时间线
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(startAnimation, 5000); // 3秒后重复
      },
    });

    // 动画阶段 1：前 2 秒放大并移动
    tl.to(light.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 2,
      ease: "power2.out",
    }).to(
      light.position,
      {
        y: y + 2,
        z: 1.5,
        duration: 2,
        ease: "power2.out",
      },
      "<" // 与 scale 动画同时开始
    );

    // 动画阶段 2：最后 1 秒渐隐
    tl.to(light.children[0].material, {
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lightRef.current) {
        startAnimation();
      } else {
        console.error("lightRef.current is still undefined after delay");
      }
    }, 3000); // 延迟 100ms
    return () => clearTimeout(timer);
  }, [geoData]);

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
      {/* 灯光 */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />

      {/* 地图主体 */}
      {/* <Center> */}
      {geoData.length > 0 ? (
        <>
          <ChinaMap geoData={geoData} />
          <axesHelper args={[5]} />
          <group>
            <Light
              ref={lightRef}
              position-z={2}
              rotation={[Math.PI * 0.1, Math.PI * 0.5, 0]}
            />
          </group>
        </>
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )}
      {/* </Center> */}

      {/* 交互控制 */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <axesHelper args={[5]} />
    </Canvas>
  );
};

export default Scene;
