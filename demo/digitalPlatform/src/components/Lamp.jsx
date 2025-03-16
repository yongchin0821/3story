import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Lamp = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/lamp.glb");
  // const material =
  //   materials["tripo_mat_b022b425-82a8-4abc-88b6-7fb5c5e8b4ca"].clone();
  // material.transparent = true;
  // material.opacity = 1;

  // 使用 useMemo 缓存克隆的材质
  const material = useMemo(() => {
    const clonedMaterial =
      materials["tripo_mat_b022b425-82a8-4abc-88b6-7fb5c5e8b4ca"].clone();
    clonedMaterial.transparent = true;
    clonedMaterial.opacity = 1;
    return clonedMaterial;
  }, [materials]);

  return (
    <mesh
      ref={ref}
      {...props}
      castShadow
      receiveShadow
      geometry={
        nodes["tripo_node_b022b425-82a8-4abc-88b6-7fb5c5e8b4ca"].geometry
      }
      material={material}
    />
  );
});

useGLTF.preload("/lamp.glb");

export default Lamp;
