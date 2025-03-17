import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Lamp = forwardRef((props, ref) => {
  // 使用 useMemo 缓存克隆的材质
  // const material = useMemo(() => {
  //   const clonedMaterial =
  //     materials["tripo_mat_b022b425-82a8-4abc-88b6-7fb5c5e8b4ca"].clone();
  //   clonedMaterial.transparent = true;
  //   clonedMaterial.opacity = 1;
  //   return clonedMaterial;
  // }, [materials]);

  const { nodes, materials } = useGLTF("/lamp.glb");
  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002.geometry}
        material={materials["SVGMat.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002_1.geometry}
        material={materials["SVGMat.005"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002_2.geometry}
        material={materials["SVGMat.006"]}
      />
    </group>
  );
});

useGLTF.preload("/lamp.glb");

export default Lamp;
