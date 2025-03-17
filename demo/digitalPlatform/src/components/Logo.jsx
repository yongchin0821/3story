import React, { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Logo = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/logo.glb");
  // const material =
  //   materials["tripo_mat_b022b425-82a8-4abc-88b6-7fb5c5e8b4ca"].clone();
  // material.transparent = true;
  // material.opacity = 1;

  // 使用 useMemo 缓存克隆的材质
  const material = useMemo(() => {
    const clonedMaterial = materials["SVGMat.016"].clone();
    const clonedMaterial2 = materials["SVGMat.014"].clone();

    return [clonedMaterial, clonedMaterial2];
  }, [materials]);

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve026.geometry}
        material={material[0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve026_1.geometry}
        material={material[1]}
      />
    </group>
  );
});

useGLTF.preload("/logo.glb");

export default Logo;
