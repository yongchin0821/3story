import { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Protect = forwardRef((props, ref) => {
  // 使用 useMemo 缓存克隆的材质
  // const material = useMemo(() => {
  //   const clonedMaterial =
  //     materials["tripo_mat_c395f545-ae6f-413c-95d7-b2fc8a8b1b2c"].clone();
  //   clonedMaterial.transparent = true;
  //   clonedMaterial.opacity = 1;
  //   return clonedMaterial;
  // }, [materials]);

  const { nodes, materials } = useGLTF("/protect.glb");
  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve005.geometry}
        material={materials["SVGMat.008"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve005_1.geometry}
        material={materials["SVGMat.009"]}
      />
    </group>
  );
});

useGLTF.preload("/protect.glb");

export default Protect;
