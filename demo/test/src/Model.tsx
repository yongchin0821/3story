import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/2.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve026.geometry}
        material={materials["SVGMat.016"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve026_1.geometry}
        material={materials["SVGMat.014"]}
      />
    </group>
  );
}

useGLTF.preload("/2.glb");
