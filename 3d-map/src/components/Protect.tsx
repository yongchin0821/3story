import { forwardRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const Protect = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/protect.glb");

  // 使用 useMemo 缓存克隆的材质
  const clonedMaterials = useMemo(() => {
    const clonedMaterial1 = materials["SVGMat.008"].clone();
    const clonedMaterial2 = materials["SVGMat.009"].clone();

    // 设置透明属性
    clonedMaterial1.transparent = true;
    clonedMaterial1.opacity = 1;
    clonedMaterial2.transparent = true;
    clonedMaterial2.opacity = 1;
    return [clonedMaterial1, clonedMaterial2];
  }, [materials]);

  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve005.geometry}
        material={clonedMaterials[0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve005_1.geometry}
        material={clonedMaterials[1]}
      />
    </group>
  );
});

useGLTF.preload("/protect.glb");

export default Protect;
