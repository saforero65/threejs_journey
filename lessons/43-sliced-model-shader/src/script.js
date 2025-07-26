import GUI from "lil-gui";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import slicedFragmentShader from "./shaders/sliced/fragment.glsl";
import slicedVertexShader from "./shaders/sliced/vertex.glsl";
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const rgbeLoader = new RGBELoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Environment map
 */
rgbeLoader.load("./aerodynamics_workshop.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.backgroundBlurriness = 0.5;
  scene.environment = environmentMap;
});

/**
 * Sliced model
 */
const uniforms = {
  uSliceStart: new THREE.Uniform(1.75),
  uSliceArc: new THREE.Uniform(1.25),
};

gui
  .add(uniforms.uSliceStart, "value", -Math.PI, Math.PI, 0.001)
  .name("Sliced Start");
gui.add(uniforms.uSliceArc, "value", 0, Math.PI, 0.001).name("Sliced Arc");

const patchMap = {
  csm_Slice: {
    "#include <colorspace_fragment>": `
    #include <colorspace_fragment>

    if(!gl_FrontFacing)
        gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
    `,
  },
};

// Geometry
const geometry = new THREE.IcosahedronGeometry(2.5, 5);

// Material
const material = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: "#858080",
});

const slicedMaterial = new CustomShaderMaterial({
  //CSM
  baseMaterial: THREE.MeshStandardMaterial,
  uniforms: uniforms,
  patchMap: patchMap,

  vertexShader: slicedVertexShader,
  fragmentShader: slicedFragmentShader,
  silence: true,

  //Mesh standard material properties
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: "#858080",
  side: THREE.DoubleSide,
});

const slicedDepthMaterial = new CustomShaderMaterial({
  //CSM
  baseMaterial: THREE.MeshDepthMaterial,
  uniforms: uniforms,
  patchMap: patchMap,

  vertexShader: slicedVertexShader,
  fragmentShader: slicedFragmentShader,
  silence: true,

  depthPacking: THREE.RGBADepthPacking,
});

// Model
let model = null;
gltfLoader.load("./gears.glb", (gltf) => {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "outerHull") {
        child.material = slicedMaterial;
        child.customDepthMaterial = slicedDepthMaterial;
      } else {
        child.material = material;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh)

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: "#aaaaaa" })
);
plane.receiveShadow = true;
plane.position.x = -4;
plane.position.y = -3;
plane.position.z = -4;
plane.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.normalBias = 0.05;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-5, 5, 12);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //Update model rotation
  if (model) {
    model.rotation.y = elapsedTime * 0.2;
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
