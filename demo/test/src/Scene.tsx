import * as THREE from "three";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { color } from "three/tsl";
import gsap from "gsap";

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => {
        setHover(true);
        gsap.to(meshRef.current.material, {
          opacity: 0.1,
          duration: 2,
        });
      }}
      onPointerOut={(event) => {
        setHover(false);
        meshRef.current.material.opacity = 1;
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        transparent={true}
        color={hovered ? "hotpink" : "#2f74c0"}
      />
    </mesh>
  );
}

const Scene = () => {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default Scene;
