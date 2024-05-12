import * as THREE from 'three';
//canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

//Geometry
const myGeometry = new THREE.BoxGeometry(1, 1, 1);

//Material
const myMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

//Mesh
const myMesh = new THREE.Mesh(myGeometry, myMaterial);

//Add to scene
scene.add(myMesh);

//Camera
const sizes = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);






