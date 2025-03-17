import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Star = forwardRef((props, ref) => {
  // 使用 useMemo 缓存克隆的材质
  // const material = useMemo(() => {
  //   const clonedMaterial =
  //     materials["tripo_mat_fdbd5008-8ef8-47c0-a111-5610c514f3fb"].clone();
  //   clonedMaterial.transparent = true;
  //   clonedMaterial.opacity = 0;
  //   return clonedMaterial;
  // }, [materials]);

  const { nodes, materials } = useGLTF("/star.glb");
  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve_1.geometry}
        material={materials["SVGMat.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve_2.geometry}
        material={materials["SVGMat.002"]}
      />
    </group>
  );
});

useGLTF.preload("/star.glb");

export default Star;
