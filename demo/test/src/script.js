import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertexParticles.glsl";

import simFragment from "./shaders/simFragment.glsl";
import simVertex from "./shaders/simVertex.glsl";

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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * fbo mesh
 * @returns
 */
function getRenderTarget() {
  const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
  return renderTarget;
}

let fbo = getRenderTarget();
let fbo1 = getRenderTarget();

const fboScene = new THREE.Scene();
const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
fboCamera.position.set(0, 0, 0.5);
fboCamera.lookAt(0, 0, 0);

const fboGeometry = new THREE.PlaneGeometry(2, 2);

let data = new Float32Array(size * size * 4);

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    let index = (i + j * size) * 4;
    let theta = Math.random() * Math.PI * 2;
    let r = 0.5 + Math.random() * 0.5;

    data[index + 0] = r * Math.cos(theta);
    data[index + 1] = r * Math.sin(theta);
    data[index + 2] = 1;
    data[index + 3] = 1;
  }
}

const fboTexture = new THREE.DataTexture(
  data,
  size,
  size,
  THREE.RGBAFormat,
  THREE.FloatType
);
fboTexture.magFilter = THREE.NearestFilter;
fboTexture.minFilter = THREE.NearestFilter;
fboTexture.needsUpdate = true;

const fboMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uPositions: { value: fboTexture },
    uInfo: { value: null },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
  },
  vertexShader: simVertex,
  fragmentShader: simFragment,
});

let infoArray = new Float32Array(size * size * 4);

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    let index = (i + j * size) * 4;
    infoArray[index + 0] = 0.5 + Math.random();
    infoArray[index + 1] = 0.5 + Math.random();
    infoArray[index + 2] = 1;
    infoArray[index + 3] = 1;
  }
}

const info = new THREE.DataTexture(
  infoArray,
  size,
  size,
  THREE.RGBAFormat,
  THREE.FloatType
);
info.magFilter = THREE.NearestFilter;
info.minFilter = THREE.NearestFilter;
info.needsUpdate = true;
fboMaterial.uniforms.uInfo.value = info;

const fboMesh = new THREE.Mesh(fboGeometry, fboMaterial);
fboScene.add(fboMesh);

renderer.setRenderTarget(fbo);
renderer.render(fboScene, fboCamera);
renderer.setRenderTarget(fbo1);
renderer.render(fboScene, fboCamera);

/**
 * Test mesh
 */
// Scene
const scene = new THREE.Scene();

// Geometry
const count = size ** 2;

let geometry = new THREE.BufferGeometry();
let positions = new Float32Array(count * 3);
let uv = new Float32Array(count * 2);
for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    let index = i + j * size;
    positions[index * 3 + 0] = Math.random();
    positions[index * 3 + 1] = Math.random();
    positions[index * 3 + 2] = 0;

    uv[index * 2 + 0] = i / size;
    uv[index * 2 + 1] = j / size;
  }
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  //   wireframe: true,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uPositions: { value: null },
    resolution: {
      value: new THREE.Vector4(),
    },
  },
  side: THREE.DoubleSide,
});

// Points
material.uniforms.uPositions.value = fboTexture;
const points = new THREE.Points(geometry, material);
scene.add(points);

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  1000
);
camera.position.set(0, 0, 4);
scene.add(camera);

/**
 * raycaster
 */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const setupEvents = () => {
  const dummy = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
  document.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    let intersects = raycaster.intersectObject(dummy);
    if (intersects.length > 0) {
      let { x, y } = intersects[0].point;
      fboMaterial.uniforms.uMouse.value = new THREE.Vector2(x, y);
    }
  });
};
setupEvents();
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  time += 0.01;
  //Update material
  material.uniforms.uTime.value = elapsedTime;
  fboMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  fboMaterial.uniforms.uPositions.value = fbo1.texture;
  material.uniforms.uPositions.value = fbo.texture;

  // Render
  renderer.setRenderTarget(fbo);
  renderer.render(fboScene, fboCamera);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  let temp = fbo;
  fbo = fbo1;
  fbo1 = temp;
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
