import GUI from "lil-gui";
import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";
import terrainVertexShader from "./shaders/terrain/vertex.glsl";
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

/**
 * Environment map
 */
rgbeLoader.load("/spruit_sunrise.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.backgroundBlurriness = 0.5;
  scene.environment = environmentMap;
});

/**
 * Terrain
 */
const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
geometry.rotateX(-Math.PI * 0.5);

// Material
debugObject.colorWaterDeep = "#1b3d6b";
debugObject.colorWaterShallow = "#6b9dcf";
debugObject.colorSand = "#f2d6a0";
debugObject.colorGrass = "#85d534";
debugObject.colorRock = "#7a7a7a";
debugObject.colorSnow = "#ffffff";

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.2),
  uStrength: new THREE.Uniform(2.0),
  uWarpFrequency: new THREE.Uniform(5),
  uWarpStrength: new THREE.Uniform(0.5),

  uColorWaterDeep: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterDeep)
  ),
  uColorWaterShallow: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterShallow)
  ),
  uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
  uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
  uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
  uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
};

gui
  .add(uniforms.uPositionFrequency, "value", 0.01, 1, 0.01)
  .name("Position Frequency");
gui.add(uniforms.uStrength, "value", 0.1, 10, 0.1).name("Position Strength");
gui.add(uniforms.uWarpFrequency, "value", 0.1, 10, 0.01).name("Warp Frequency");
gui.add(uniforms.uWarpStrength, "value", 0.01, 1, 0.01).name("Warp Strength");
gui
  .addColor(debugObject, "colorWaterDeep")
  .onChange(() => {
    uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep);
  })
  .name("Water Deep Color");
gui
  .addColor(debugObject, "colorWaterShallow")
  .onChange(() => {
    uniforms.uColorWaterShallow.value.set(debugObject.colorWaterShallow);
  })
  .name("Water Shallow Color");
gui
  .addColor(debugObject, "colorSand")
  .onChange(() => {
    uniforms.uColorSand.value.set(debugObject.colorSand);
  })
  .name("Sand Color");
gui
  .addColor(debugObject, "colorGrass")
  .onChange(() => {
    uniforms.uColorGrass.value.set(debugObject.colorGrass);
  })
  .name("Grass Color");
gui
  .addColor(debugObject, "colorRock")
  .onChange(() => {
    uniforms.uColorRock.value.set(debugObject.colorRock);
  })
  .name("Rock Color");
gui
  .addColor(debugObject, "colorSnow")
  .onChange(() => {
    uniforms.uColorSnow.value.set(debugObject.colorSnow);
  })
  .name("Snow Color");

const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshStandardMaterial,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  uniforms: uniforms,
  silent: true,

  metalness: 0,
  roughness: 0.8,
  color: "#85d534",
  side: THREE.DoubleSide,
});

const depthMaterial = new CustomShaderMaterial({
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: terrainVertexShader,
  uniforms: uniforms,
  silent: true,

  depthPacking: THREE.RGBADepthPacking,
});

const terrain = new THREE.Mesh(geometry, material);
terrain.customDepthMaterial = depthMaterial;
terrain.receiveShadow = true;
terrain.castShadow = true;
scene.add(terrain);

/**
 * Water
 */
const water = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 1, 1),
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0.1,
    ior: 1.33,
    thickness: 0.01,
    color: debugObject.colorWaterShallow,
    side: THREE.DoubleSide,
    envMap: scene.environment,
    envMapIntensity: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 0.5,
  })
);
water.rotateX(-Math.PI * 0.5);
water.position.y = -0.1;

scene.add(water);

/**
 * Board
 */
// Brushes
const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));

// boardFill.position.y = 0.2;
// boardHole.position.x = 0.2;
// boardHole.scale.set(2, 1, 3);

//Evaluate
const evaluator = new Evaluator();
const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);

board.material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 0,
  roughness: 0.3,
  side: THREE.DoubleSide,
});

board.castShadow = true;
board.receiveShadow = true;

scene.add(board);
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
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
camera.position.set(-10, 6, -2);
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update uniforms
  uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
