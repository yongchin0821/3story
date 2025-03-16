import { Canvas } from "@react-three/fiber";
import MainScene from "./MainScene";
import SectionOne from "./SectionOne";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import "./App.css";

function App() {
  return (
    <>
      <Canvas
        camera={{
          fov: 35,
          near: 0.1,
          far: 100,
          position: [0, 0, 6],
        }}
        className="webgl"
      >
        <directionalLight position={[1, 1, 0]} />
        <ambientLight color={"#ffffff"} intensity={3} />
        <MainScene />
      </Canvas>
      <section className="section">
        <SectionOne />
      </section>
      <section className="section">
        <SectionTwo />
      </section>
      <section className="section">
        <SectionThree />
      </section>
    </>
  );
}

export default App;
