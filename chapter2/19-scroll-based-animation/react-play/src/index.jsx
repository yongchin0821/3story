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
      <div className="header"></div>
      <div className="body flex flex-col justify-center">
        <h1 className="page-title">
          Date <span className="accent">Goverance</span>
        </h1>
        <h1>数聚治理</h1>
        <p style={{ fontSize: "24px" }}>干净、整洁</p>
      </div>
      <div className="footer">
        <div>dsda</div>
        <span className="mt-8 animate-bounce">
          <i className="i-mingcute-right-line rotate-90 text-2xl">ddd </i>
        </span>
      </div>
    </section>
    <section className="section">
      <div className="body flex flex-col justify-center items-end">
        <h1 className="page-title">My projects</h1>
      </div>
    </section>
    <section className="section">
      <div className="body flex flex-col justify-center">
        <h1 className="page-title">Contact me</h1>
      </div>
    </section>
  </>
);
