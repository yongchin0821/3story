import { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Battery = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/battery.glb");
  // const material =
  //   materials["tripo_mat_c395f545-ae6f-413c-95d7-b2fc8a8b1b2c"].clone();
  // material.transparent = true;
  // material.opacity = 1;

  // 使用 useMemo 缓存克隆的材质
  const material = useMemo(() => {
    const clonedMaterial =
      materials["tripo_mat_c395f545-ae6f-413c-95d7-b2fc8a8b1b2c"].clone();
    clonedMaterial.transparent = true;
    clonedMaterial.opacity = 1;
    return clonedMaterial;
  }, [materials]);

  return (
    <mesh
      {...props}
      ref={ref}
      castShadow
      receiveShadow
      geometry={
        nodes["tripo_node_c395f545-ae6f-413c-95d7-b2fc8a8b1b2c"].geometry
      }
      material={material}
    />
  );
});

useGLTF.preload("/battery.glb");

export default Battery;
