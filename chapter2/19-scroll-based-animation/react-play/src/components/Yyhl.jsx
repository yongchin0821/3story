import React, { useRef, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

const Model = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/yyhlnew217.glb");
  return (
    <group {...props} ref={ref} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve.geometry}
        material={materials["SVGMat.010"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve010.geometry}
        material={materials["SVGMat.016"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve013.geometry}
        material={materials["SVGMat.014"]}
      />
    </group>
  );
});

useGLTF.preload("/yyhl.glb");

export default Model;
