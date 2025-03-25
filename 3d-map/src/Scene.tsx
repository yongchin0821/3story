import { Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useAtom } from "jotai";
import { useControls } from "leva";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import selectedRegionIndexAtom from "./atoms";
import Lamp from "./components/Lamp";
import Star from "./components/Star";
import Protect from "./components/Protect";
import Stats from "stats.js";

// 常量抽离
const CENTER_LNG = 110;
const CENTER_LAT = 35;

// 补全 Feature 接口，添加 center（可选）字段
interface Feature {
  type: string;
  properties: {
    name: string;
    adcode?: string;
    center?: [number, number]; // 可选中心点数据
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][][] | number[][][];
  };
}

// 工具函数：对坐标偏移
const transformCoord = ([lng, lat]: [number, number]): [number, number] => [
  lng - CENTER_LNG,
  lat - CENTER_LAT,
];

// 工具函数：构建 shapes
const buildShapes = (feature: Feature): THREE.Shape[] => {
  const shapes: THREE.Shape[] = [];
  const coordinates =
    feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates];

  coordinates.forEach((polygon) => {
    polygon.forEach((ring) => {
      const shape = new THREE.Shape();
      ring.forEach((coord, i) => {
        const [x, y] = transformCoord(coord as [number, number]);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      shapes.push(shape);
    });
  });
  return shapes;
};

//fps
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

interface MapShapeProps {
  feature: Feature;
  index: number;
  isSelected: boolean;
}

let currentSecond = 0;
const MapShape: React.FC<MapShapeProps> = memo(
  ({ feature, index, isSelected }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const { color, Linecolor } = useControls({
      color: "#ffffff",
      Linecolor: "#151d1c",
    });
    console.log(feature.properties.adcode);
    // 使用 useMemo 缓存计算结果
    const shapes = useMemo(() => buildShapes(feature), [feature]);

    // 根据 hover 或选中状态调整 extrude 深度
    const extrudeSettings = useMemo(
      () => ({
        depth: hovered || isSelected ? 1.5 : 0.5,
        bevelEnabled: false,
      }),
      [hovered, isSelected, index]
    );

    const geometry = useMemo(
      () => new THREE.ExtrudeGeometry(shapes, extrudeSettings),
      [shapes, extrudeSettings]
    );
    const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    // 事件处理使用 useCallback
    const handlePointerOver = useCallback(() => {
      setHovered(true);
      // console.log("Region:", feature.properties.name);
    }, [feature.properties.name]);

    const handlePointerOut = useCallback(() => {
      setHovered(false);
    }, []);
    // console.log('shapes重新渲染:' + index + isSelected);
    return (
      <group name={feature.properties.adcode}>
        {/* 区域主体 */}
        <mesh
          ref={meshRef}
          geometry={geometry}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial
            color={hovered || isSelected ? "#ff6b6b" : color}
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>

        {/* 边界线 */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={Linecolor} linewidth={2} />
        </lineSegments>
      </group>
    );
  }
);

interface ChinaMapProps {
  geoData: Feature[];
}

// 工具函数：计算区域中心（备用，当 feature.properties.center 不存在时）
const calculateShapeCenter = (coordinates: number[][][][] | number[][][]) => {
  let xSum = 0,
    ySum = 0,
    count = 0;
  const coords = Array.isArray(coordinates[0][0][0])
    ? coordinates[0][0]
    : coordinates[0];
  coords.forEach(([lng, lat]) => {
    const [x, y] = transformCoord([lng, lat]);
    xSum += x;
    ySum += y;
    count++;
  });
  return [xSum / count, ySum / count];
};

const ChinaMap: React.FC<ChinaMapProps> = ({ geoData, refList }) => {
  console.log("ChinaMap重新渲染");
  const [selectedRegionIndex] = useAtom(selectedRegionIndexAtom);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [, setSelectedRegionIndex] = useAtom(selectedRegionIndexAtom);

  const startAnimation = useCallback(() => {
    if (!geoData.length) return;
    const randomIndex = Math.floor(Math.random() * geoData.length);
    const iconIndex = Math.floor(Math.random() * refList.length);
    const region = geoData[randomIndex];
    setSelectedRegionIndex(randomIndex);

    const iconRef = refList[iconIndex];
    // 使用 feature.properties.center 如果存在，否则 fallback 计算中心
    const center1 =
      // [region.properties.center[0] - 110, region.properties.center[1] - 35] ||
      calculateShapeCenter(region.geometry.coordinates);
    const [x, y] = center1;
    const icon = iconRef.current;
    if (!icon) return;
    icon.position.set(x, y, 2);
    icon.scale.setScalar(1);

    // 确保 material 存在
    const materials = icon.children.map((child) => child.material);
    materials.forEach((material) => {
      material.opacity = 0; // 初始设置为完全透明
    });

    // 如果存在旧的时间轴，先清除
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // 创建新的时间轴
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        setSelectedRegionIndex(null);
      },
    });

    timelineRef.current
      .to(materials, {
        opacity: 1, // 淡入：从 0 到 1
        duration: 1,
        ease: "power2.in",
      })
      .to(
        icon.scale,
        {
          x: 3.5,
          y: 3.5,
          z: 3.5,
          duration: 2,
          ease: "bounce.out",
        },
        "<"
      ) // 与淡入同时开始
      .to(
        icon.position,
        {
          y: y + 3,
          z: 2.5,
          duration: 2,
          ease: "power2.out",
        },
        "<"
      )
      .to(materials, {
        opacity: 0, // 淡出：从 1 到 0
        duration: 1,
        ease: "power2.out",
      });
  }, [geoData, refList, setSelectedRegionIndex]);

  useFrame((state, deltaTime) => {
    stats.begin();
    const nowSecond = Math.floor(state.clock.elapsedTime);
    if (nowSecond !== currentSecond) {
      // console.log(nowSecond, currentSecond);
      currentSecond = nowSecond;
      if (!(currentSecond % 4)) {
        // console.log("startAnimation");
        startAnimation();
      }
    }
    stats.end();
  });

  return (
    <group name="chinaMapGroup">
      {geoData.map((feature, index) => (
        <MapShape
          key={feature.properties.adcode || index}
          feature={feature}
          index={index}
          isSelected={index === selectedRegionIndex}
        />
      ))}
    </group>
  );
};

const Scene: React.FC = () => {
  // const geoData = useGeoData(
  //   "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
  // );
  console.log("Sence重新渲染");
  const url = "/geodata.json";
  const [geoData, setGeoData] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        data.features.pop(); // 移除最后一个元素
        setGeoData(data.features);
      } catch (error) {
        console.error("Failed to fetch GeoJSON:", error);
      }
    };
    fetchGeoJSON();
  }, [url]);

  const chinaMapRef = useRef<THREE.Group>(null);
  const lampRef = useRef<THREE.Mesh>(null);
  const stationRef = useRef<THREE.Mesh>(null);
  const batteryRef = useRef<THREE.Mesh>(null);
  const refList = [lampRef, stationRef, batteryRef];

  return (
    <group>
      <Center ref={chinaMapRef}>
        <ChinaMap geoData={geoData} refList={refList} />
        <Lamp ref={lampRef} rotation={[Math.PI * 0.1, -Math.PI * 0.5, 0]} />
        <Star ref={stationRef} rotation={[Math.PI * 0.1, -Math.PI * 0.5, 0]} />
        <Protect
          ref={batteryRef}
          rotation={[Math.PI * 0.1, -Math.PI * 0.5, 0]}
        />
        {/* <axesHelper args={[5]} /> */}
      </Center>
    </group>
  );
};

export default Scene;
