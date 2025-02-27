import { useState } from "react";
import Scene from "./Scene";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Scene style={{ width: "100vw" }} />
    </>
  );
}

export default App;
