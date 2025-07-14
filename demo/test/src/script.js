import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertex from "./shaders/vertex.glsl";
import fragmentFBO from "./shaders/fbo.glsl";

/**
 * Base
 */
const size = 256;
let time = 0;
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);
camera.position.set(0, 0, 2);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: false,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * raycaster
 */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const setupEvents = () => {
  const raycastPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0xfefefe, side: THREE.DoubleSide })
  );

  const dummy = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  scene.add(dummy);

  window.addEventListener("mousemove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(raycastPlane);
    if (intersects.length > 0) {
      dummy.position.copy(intersects[0].point);
    }
  });
};

setupEvents();

/**
 * fbo mesh
 * @returns
 */
function getRenderTarget() {
  const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
  return renderTarget;
}

const whiteTarget = getRenderTarget();
const whiteScene = new THREE.Scene();
const whitebg = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
whiteScene.add(whitebg);
// whitebg.position.z = -1;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.3, 0.3),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
whiteScene.add(box);

renderer.setRenderTarget(null);
renderer.render(whiteScene, camera);

/**
 * final scene
 * This scene will be used to render the final output
 */
const sourceTarget = getRenderTarget();
let targetA = getRenderTarget();
let targetB = getRenderTarget();

// renderer.setRenderTarget(whiteTarget);
// renderer.render(whiteScene, camera);

const a = whiteTarget.texture;
const fboScene = new THREE.Scene();
const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const fboMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: null },
    tPrev: { value: whiteTarget.texture },
    resolution: { value: new THREE.Vector4(sizes.width, sizes.height, 1, 1) },
  },
  vertexShader: vertex,
  fragmentShader: fragmentFBO,
});

const fboQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial);
fboScene.add(fboQuad);

const finalScene = new THREE.Scene();
const finalQuad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ map: targetA.texture })
);
finalScene.add(finalQuad);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

renderer.setRenderTarget(whiteTarget);
renderer.render(whiteScene, camera);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  time += 0.01;

  // Update controls
  controls.update();

  // rendering the source
  renderer.setRenderTarget(sourceTarget);
  renderer.render(scene, camera);

  // // running ping pong
  renderer.setRenderTarget(targetA);
  renderer.render(fboScene, fboCamera);

  fboMaterial.uniforms.tDiffuse.value = sourceTarget.texture;
  fboMaterial.uniforms.tPrev.value = targetA.texture;

  finalQuad.material.map = targetA.texture;
  renderer.setRenderTarget(null);
  renderer.render(finalScene, fboCamera);

  let temp = targetA;
  targetA = targetB;
  targetB = temp;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
