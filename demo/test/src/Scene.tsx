import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";

const Scene = () => {
  console.log("xuanran");
  return (
    // <></>
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
      <Model />
    </Canvas>
  );
};

export default Scene;
