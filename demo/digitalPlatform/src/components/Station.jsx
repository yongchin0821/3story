
import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Station = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/station.glb");
  // const material =
  //   materials["tripo_mat_fdbd5008-8ef8-47c0-a111-5610c514f3fb"].clone();
  // material.transparent = true;
  // material.opacity = 1;

  // 使用 useMemo 缓存克隆的材质
  const material = useMemo(() => {
    const clonedMaterial =
      materials["tripo_mat_fdbd5008-8ef8-47c0-a111-5610c514f3fb"].clone();
    clonedMaterial.transparent = true;
    clonedMaterial.opacity = 0;
    return clonedMaterial;
  }, [materials]);

  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      receiveShadow
      geometry={
        nodes["tripo_node_fdbd5008-8ef8-47c0-a111-5610c514f3fb"].geometry
      }
      material={material}
    />
  );
});

useGLTF.preload("/station.glb");

export default Station;
