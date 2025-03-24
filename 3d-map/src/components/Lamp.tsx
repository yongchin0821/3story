import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Lamp = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/lamp.glb");

  // 使用 useMemo 缓存克隆的材质
  const clonedMaterials = useMemo(() => {
    const clonedMaterial1 = materials["SVGMat.004"].clone();
    const clonedMaterial2 = materials["SVGMat.005"].clone();
    const clonedMaterial3 = materials["SVGMat.006"].clone();

    // 设置透明属性
    clonedMaterial1.transparent = true;
    clonedMaterial1.opacity = 1;
    clonedMaterial2.transparent = true;
    clonedMaterial2.opacity = 1;
    clonedMaterial3.transparent = true;
    clonedMaterial3.opacity = 1;

    return [clonedMaterial1, clonedMaterial2, clonedMaterial3];
  }, [materials]);

  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002.geometry}
        material={clonedMaterials[0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002_1.geometry}
        material={clonedMaterials[1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002_2.geometry}
        material={clonedMaterials[2]}
      />
    </group>
  );
});

useGLTF.preload("/lamp.glb");

export default Lamp;
