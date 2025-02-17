import { useRef } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import * as Three from "three";
import Yyhl from "./components/Yyhl";

export default function MainScene() {
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * objects
   */
  const yy = useRef();

  const mesh1 = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();

  const objectDistance = 4;
  const sectionMeshes = [mesh2, mesh3];

  const parameters = {
    materialColor: "#ffeded",
  };

  const gradientTexture = useLoader(
    Three.TextureLoader,
    "textures/gradients/3.jpg"
  );
  gradientTexture.magFilter = Three.NearestFilter;

  const texturePorps = {
    gradientMap: gradientTexture,
    color: parameters.materialColor,
  };

  /**
   * Camera
   */
  //   const { camera } = useThree();
  //   cameraGroup.add(camera);

  /**
   * Scroll
   */

  let scrollY = window.scrollY;
  let currentSection = 0;

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    // const newSection = Math.round(scrollY / sizes.height);
    // if (newSection != currentSection) {
    //   currentSection = newSection;

    //   gsap.to(sectionMeshes[currentSection].rotation, {
    //     duration: 1.5,
    //     ease: "power2.inOut",
    //     x: "+=6",
    //     y: "+=3",
    //     z: "+=1.5",
    //   });
    // }
  });
  /**
   * Cursor
   */
  const cursor = {};
  cursor.x = 0;
  cursor.y = 0;
  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });
  /**
   *
   */

  useFrame((state, deltaTime) => {
    state.camera.position.y = (-scrollY / sizes.height) * objectDistance;
    // console.log(state.camera.position.y);
    //camera
    // cameraGroup.position.x +=
    //   (cursor.x * 0.3 - cameraGroup.position.x) * 5 * deltaTime;
    // cameraGroup.position.y +=
    //   (-cursor.y * 0.3 - cameraGroup.position.y) * 5 * deltaTime;

    //geometry rotation
    for (const mesh of sectionMeshes) {
      mesh.current.rotation.x += deltaTime * 0.1;
      mesh.current.rotation.y += deltaTime * 0.12;
    }

    yy.current.rotation.y +=
      (cursor.x * 0.1 - yy.current.rotation.y) * 2 * deltaTime;
    yy.current.rotation.x +=
      (cursor.y * 0.1 - yy.current.rotation.x) * 2 * deltaTime;
    yy.current.position.x +=
      (cursor.x * 0.1 - yy.current.position.x) * 2 * deltaTime;
    yy.current.position.y +=
      (-cursor.y * 0.1 - yy.current.position.y) * 2 * deltaTime;

    // console.log(yy.current.rotation);
    // yy.current.rotation.x += deltaTime * 0.1;
    // yy.current.rotation.y += deltaTime * 0.12;
    // yy.current.rotation.x=Math.PI*0.5

    // console.log( yy.current.position);
  });
  return (
    <>
      {/* <group>
        <perspectiveCamera
          fov={35}
          near={0.1}
          far={100}
          position={[0, 0, 6]}
        ></perspectiveCamera>
      </group> */}
      <directionalLight position={[1, 1, 0]} />
      <ambientLight />
      <mesh
        position={[2, -objectDistance * 0, 0]}
        rotation={[-0.1, -0.2, 0]}
        ref={mesh1}
      >
        {/* <torusGeometry args={[1, 0.4, 10, 60]} />
        <meshToonMaterial {...texturePorps} /> */}
        <Yyhl ref={yy} />
      </mesh>
      <mesh position={[-2, -objectDistance * 1, 0]} ref={mesh2}>
        <coneGeometry args={[1, 2, 32]} />
        <meshToonMaterial {...texturePorps} />
      </mesh>
      <mesh position={[2, -objectDistance * 2, 0]} ref={mesh3}>
        <torusKnotGeometry args={[0.8, 0.35, 100, 16]} />
        <meshToonMaterial {...texturePorps} />
      </mesh>
    </>
  );
}
