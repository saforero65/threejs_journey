import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import holographicFragmentShader from './shaders/holographic/fragment.glsl'
import holographicVertexShader from './shaders/holographic/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 7, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })


/**
 * Material
 */
const materialParamenters = {}
materialParamenters.color = '#ff0000'

gui.addColor(materialParamenters, 'color')
    .onChange(() =>
    {
        material.uniforms.uColor.value.set(materialParamenters.color)
    })

const material = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(new THREE.Color(materialParamenters.color))
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
// scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
// scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
    './Dayo.glb',
    (gltf) =>
    {
        suzanne = gltf.scene
        suzanne.scale.set(3, 3, 3) // Scale down the model
        suzanne.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

let suzanne2 = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) =>
    {
        suzanne2 = gltf.scene
        
        suzanne2.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
        })
        suzanne2.position.x = - 3
        suzanne2.position.y = 1.5
        scene.add(suzanne2)
    }
)
// let car = null
// gltfLoader.load(
//     './car.glb',
//     (gltf) =>
//     {
//         car = gltf.scene
//         car.scale.set(0.5, 0.5, 0.5) // Scale down the model
//         car.traverse((child) =>
//         {
//             if (child.isMesh) {
//                 child.material = material.clone(); // Apply the holographic material
//                 child.material.uniforms = {
//                     uTime: new THREE.Uniform(0),
//                     uColor: new THREE.Uniform(new THREE.Color(materialParamenters.color))
//                 }; // Ensure each material has its own uniforms
//             }
//         })
//         scene.add(car)
//     }
// )

// let sasRed = null
// gltfLoader.load(
//     './sas red.glb',
//     (gltf) =>
//     {
//         sasRed = gltf.scene
//         sasRed.scale.set(50, 50, 50) // Scale down the model
//         sasRed.position.x = -1 // Move the model to the left
//         sasRed.traverse((child) =>
//         {
//             if(child.isMesh)
//                 child.material = material
//         })
//         scene.add(sasRed)
//     }
// )

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Rotate objects
    // if(suzanne)
    // {
   

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()