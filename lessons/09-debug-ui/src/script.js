import gsap from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Debug
 */
const gui = new GUI({
    title: "Nice Debug UI",
    closeFolders: true,
});
gui.hide(); 

window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
        gui.show(gui._hidden);
    }
}
);


const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// Debug
debugObject.color = "#00ffee";

let geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let folder = gui.addFolder("Mesh Controls");

folder.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
folder.add(mesh, "visible");
folder.add(material, "wireframe");
folder.addColor(debugObject, "color").onChange((value) => {
  material.color.set(debugObject.color);
});

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1.5, y: mesh.rotation.y + Math.PI * 2 });

  let yOriginal = mesh.position.y;
  gsap
    .timeline()
    .to(mesh.position, { duration: 1, y: yOriginal + 1 }) // sube
    .to(mesh.position, { duration: 0.5, y: yOriginal }); // baja
};

folder.add(debugObject, "spin");

debugObject.subdivision = 2;
folder.add(debugObject, "subdivision").min(0).max(10).step(1).onFinishChange(() => {
  geometry.dispose();
  geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
  mesh.geometry = geometry;
});

folder.open();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
