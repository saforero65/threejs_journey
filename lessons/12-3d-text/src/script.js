import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const donuts = []

const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 25,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments:16
            }
        )
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        console.time('donuts')

        gui.add(text.position, 'x').min(- 3).max(3).step(0.01).name('textX')
        gui.add(text.position, 'y').min(- 3).max(3).step(0.01).name('textY')
        gui.add(text.position, 'z').min(- 3).max(3).step(0.01).name('textZ')

        gui.add(text.rotation, 'x').min(- Math.PI).max(Math.PI).step(0.01).name('textRotationX')
        gui.add(text.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.01).name('textRotationY')
        gui.add(text.rotation, 'z').min(- Math.PI).max(Math.PI).step(0.01).name('textRotationZ')

        gui.add(text.scale, 'x').min(0).max(3).step(0.01).name('textScaleX')
        gui.add(text.scale, 'y').min(0).max(3).step(0.01).name('textScaleY')
        gui.add(text.scale, 'z').min(0).max(3).step(0.01).name('textScaleZ')

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
       for(let i=0; i<200; i++){
    
    const donut = new THREE.Mesh(donutGeometry, textMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut)

    // Add donut to the array
    donuts.push(donut)
}
        console.timeEnd('donuts')
    }
)



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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
    const elapsedTime = clock.getElapsedTime()

     // Animate camera
     const radius = 2.7; // distance from the center
     const speed = 0.15; // rotation speed
     camera.position.x = radius * Math.cos(speed * elapsedTime);
     camera.position.z = radius * Math.sin(speed * elapsedTime);
     camera.lookAt(0, 0, 0); // make the camera look at the center
 

    // Animate donuts
    for(let i=0; i<donuts.length; i++){
        donuts[i].rotation.x += 0.01
        donuts[i].rotation.y += 0.01
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()