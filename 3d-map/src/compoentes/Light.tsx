import React, { forwardRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Model = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/light.glb");
  //   console.log(materials);
  const material =
    materials["tripo_material_1bd8f693-3395-4993-a106-1f135c20a476"].clone();
  material.transparent = true;
  material.opacity = 1;

  useEffect(() => {
    console.log("Light component mounted");
  }, []);

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={
          nodes["tripo_node_1bd8f693-3395-4993-a106-1f135c20a476"].geometry
        }
        material={material}
      />
    </group>
  );
});

useGLTF.preload("/light.glb");

export default Model;
