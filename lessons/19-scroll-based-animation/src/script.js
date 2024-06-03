import gsap from 'gsap'
import GUI from 'lil-gui'
import * as THREE from 'three'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#00fbff'
}

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Objects
 */
const objectDistance = 4
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture })
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,32,32),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.2,132,32),
    material
)

mesh2.position.y =  -objectDistance * 1
mesh3.position.y =  -objectDistance * 2

mesh1.position.x =2
mesh2.position.x =-2
mesh3.position.x =2

scene.add(mesh1, mesh2, mesh3)

const sectionMesehes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const particlesCount = 500
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMesehes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    color: parameters.materialColor
})

const particles = new THREE.Points(geometry, particlesMaterial)
scene.add(particles)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

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

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll Animation
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll',(e)=>{
    scrollY = window.scrollY

    const section = Math.round(scrollY / sizes.height)
    if(section !== currentSection){
        currentSection = section
        gsap.to(
            sectionMesehes[currentSection].rotation,
            {   
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=2'
            }
        )


    }
    
})

/**
 * Cursor
 */

const cursor ={}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(e)=>{
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = -(e.clientY / sizes.height - 0.5)
})



/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    //Animate camera
    cameraGroup.position.y = -scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x 
    const parallaxY = cursor.y

    camera.position.x += (parallaxX - camera.position.x ) * 5 * deltaTime
    camera.position.y += (parallaxY - camera.position.y ) * 5 *deltaTime


    //Animate meshes
    sectionMesehes.forEach((mesh, index) => {
        mesh.rotation.x += deltaTime * 0.2
        mesh.rotation.y += deltaTime * 0.12
    })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()