import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)
    },
    () =>
    {
        console.log('progress')
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Environment map
 */

scene.environmentIntensity = 1
scene.backgroundBlurriness = 0
scene.backgroundIntensity = 0.8



gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)


/**
 * Real time environment map
 */
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.environment = environmentMap
scene.background = environmentMap

/**
 * Holy Donut
 */
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5, 16, 100),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10,4,2)})
)
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5
scene.add(holyDonut)

//Cube Render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256,{
    type: THREE.HalfFloatType,
})

scene.environment = cubeRenderTarget.texture

//Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)





// gui.add(scene.backgroundRotation, 'x').min(0).max(10).step(0.001).name('backgroundRotationX')
// gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotationY')
// gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotationY')


// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ])
// scene.background = environmentMap
// scene.environment = environmentMap

//HDR (RGBE) equirectangular environment map
// rgbeLoader.load(
//     '/environmentMaps/0/2k.hdr',
//     (environmentMap) =>
//     {
//         environmentMap.mapping = THREE.EquirectangularReflectionMapping        
//         scene.environment = environmentMap
//         scene.background = environmentMap

//         const skybox = new GroundedSkybox(environmentMap, 10,70)
//         // skybox.material.color = new THREE.Color(0x000000)
//         skybox.position.y = 10
//         scene.add(skybox)
//     }
// )

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshBasicMaterial({ 
        roughness: 0.4,
        metalness: 1,
        color: 0x00ff00,
        envMap: cubeRenderTarget.texture
    })
)
torusKnot.position.x = -4
torusKnot.position.y = 3
scene.add(torusKnot)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    if (holyDonut)
    {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2
        cubeCamera.update(renderer, scene)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()