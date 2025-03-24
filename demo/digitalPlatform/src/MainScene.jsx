import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Map from "./components/Map";
import Logo from "./components/Logo";

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Scroll
 */
let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

export default function MainScene() {
  const logo = useRef();
  const objectDistance = 4;

  useFrame((state, deltaTime) => {
    state.camera.position.y = (-scrollY / sizes.height) * objectDistance;

    logo.current.rotation.y +=
      (cursor.x * 0.1 - logo.current.rotation.y) * 2 * deltaTime;
    logo.current.rotation.x +=
      (cursor.y * 0.1 - logo.current.rotation.x) * 2 * deltaTime;
    logo.current.position.x +=
      (cursor.x * 0.1 - logo.current.position.x) * 2 * deltaTime;
    logo.current.position.y +=
      (-cursor.y * 0.1 - logo.current.position.y) * 2 * deltaTime;
  });
  console.log("mainScene渲染");
  return (
    <group>
      <mesh position={[2, -objectDistance * 0, 0]} rotation={[-0.1, -0.2, 0]}>
        <Logo ref={logo} />
      </mesh>
      <group
        position={[-1.5, -objectDistance * 1, 0]}
        scale={0.04}
        rotation-x={-Math.PI * 0.1}
      >
        <Map />
      </group>
      <mesh position={[2, -objectDistance * 2, 0]}></mesh>
    </group>
  );
}
