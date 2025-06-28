import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import particlesVertexShader from './shaders/particles/vertex.glsl'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 18)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Displacement
 */
const displacement ={}

// 2D canvas
displacement.canvas = document.createElement('canvas')
displacement.canvas.width = 128
displacement.canvas.height = 128
displacement.canvas.style.position = 'fixed'
displacement.canvas.style.width = '256px'
displacement.canvas.style.height = '256px'
displacement.canvas.style.top = '0'
displacement.canvas.style.left = '0'
displacement.canvas.style.zIndex = '10'
document.body.append(displacement.canvas)

//Context
displacement.context = displacement.canvas.getContext('2d')
displacement.context.fillStyle = '#000000'
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

// Glow Image
displacement.glowImage = new Image()
displacement.glowImage.src = './glow.png'

//Interactive Plane 
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
      color: 'red',
        side: THREE.DoubleSide,
        
    })
)
displacement.interactivePlane.visible = false
scene.add(displacement.interactivePlane)

//Raycaster
displacement.raycaster = new THREE.Raycaster()
displacement.screenCursor = new THREE.Vector2(9999,9999)
displacement.canvasCursor = new THREE.Vector2(9999,9999)
displacement.canvasCursorPrevious = new THREE.Vector2(9999,9999)

//Mouse move event
window.addEventListener('pointermove', (event) =>
{
    // Update mouse position
    displacement.screenCursor.set(
        (event.clientX / sizes.width) * 2 - 1,
        -(event.clientY / sizes.height) * 2 + 1
    )
})

//Texture
displacement.texture = new THREE.CanvasTexture(displacement.canvas)


/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)
particlesGeometry.setIndex(null)
particlesGeometry.deleteAttribute('normal')
const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)

for (let i = 0; i < particlesGeometry.attributes.position.count; i++)
{
    intensitiesArray[i] = Math.random()  
    anglesArray[i] = Math.random() * Math.PI * 2 
}
particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1))

const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms:
    {
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uPictureTexture: new THREE.Uniform(textureLoader.load('./picture-1.png')),
        uDisplacementTexture: new THREE.Uniform(displacement.texture),
    }
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    /**
     * Raycaster
     */
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera)
    const intersects = displacement.raycaster.intersectObject(displacement.interactivePlane)

    if (intersects.length > 0)
    {
        const uv = intersects[0].uv
        // Update canvas cursor position
        displacement.canvasCursor.set(
            uv.x * displacement.canvas.width,
            (1 - uv.y) * displacement.canvas.height
        )
    }

    /**
     * Displacement
     */
    displacement.context.globalCompositeOperation = 'source-over'
    displacement.context.globalAlpha = 0.02
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

    // Speed alpha
    const cursorDistance = displacement.canvasCursor.distanceTo(displacement.canvasCursorPrevious)
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    const alpha = Math.min(cursorDistance * 0.1, 0.1)

    //Draw glow
    const glowSize = displacement.canvas.width / 4
    displacement.context.globalCompositeOperation = 'lighten'
    displacement.context.globalAlpha = alpha
    displacement.context.drawImage(displacement.glowImage, displacement.canvasCursor.x - glowSize / 2, displacement.canvasCursor.y - glowSize / 2, glowSize, glowSize)

    // Texture
    displacement.texture.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()