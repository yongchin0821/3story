import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import MainScene from "./MainScene";
const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
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
      <MainScene></MainScene>
    </Canvas>

    <section className="section">
      <h1 className="dd">
        My <span className="accent">Portfolio</span>
      </h1>
    </section>
    <section className="section">
      <h2>My projects</h2>
    </section>
    <section className="section">
      <h2>Contact me</h2>
    </section>
  </>
);
