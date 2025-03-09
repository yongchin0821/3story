import Scene from "./Scene";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <group scale={0.1}>
          <Scene />
        </group>
        <directionalLight position={[1, 1, 0]} />
        <ambientLight color={"0x404040"} intensity={3} />
        <axesHelper args={[5]} />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

export default App;
