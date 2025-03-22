import gsap from 'gsap'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import fireworkFragmentShader from './shaders/firework/fragment.glsl'
import fireworkVertexShader from './shaders/firework/vertex.glsl'


/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

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
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.resolution.set(sizes.width, sizes.height)
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Fireworks
 */

const textures = [
    textureLoader.load('../particles/1.png'),
    textureLoader.load('../particles/2.png'),
    textureLoader.load('../particles/3.png'),
    textureLoader.load('../particles/4.png'),
    textureLoader.load('../particles/5.png'),
    textureLoader.load('../particles/6.png'),
    textureLoader.load('../particles/7.png'),
    textureLoader.load('../particles/8.png'),
]

const createFirework = (count, position, size, texture, radius, color) => {

    //Geometry
    const positionArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)
    const timeMultipliersArray = new Float32Array(count)
    
    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3

        const spherical = new THREE.Spherical(
            radius *( 0.7 + Math.random() * 0.3),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )

        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)

        positionArray[i3] = position.x;
        positionArray[i3 + 1] = position.y;
        positionArray[i3 + 2] = position.z;

        sizesArray[i] = Math.random()
        timeMultipliersArray[i] = 1 + Math.random()
    }
    
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
    geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1))

    //Material
    texture.flipY = false
    const material = new THREE.ShaderMaterial(
        {
            fragmentShader: fireworkFragmentShader,
            vertexShader: fireworkVertexShader,
            uniforms: {
                uSize: new THREE.Uniform(size),
                uResolution: new THREE.Uniform(sizes.resolution),
                uTexture: new THREE.Uniform(texture),
                uColor: new THREE.Uniform(color),
                uProgress: new THREE.Uniform(0)
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.Additive
            
        }
    )

    //Points 
    const firework = new THREE.Points(geometry, material)
    firework.position.copy(position)
    scene.add(firework)

    //Destroy
    const destroy = () => {
        scene.remove(firework)
        geometry.dispose()
        material.dispose()
    }

    //Animate
    gsap.to(material.uniforms.uProgress, {value: 1, duration: 3, ease: 'linear', onComplete: destroy})

}
createFirework(
    100, //count
    new THREE.Vector3(0, 0, 0),     //position
    0.5, //size
    textures[7], //texture
    1, //radius
    new THREE.Color(0xff0000) //color
) 

const createRandomFirework = () => {
    const count = Math.round(400 + Math.random() * 100)
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() ,
        (Math.random() - 0.5) * 2
    )
    const size = 0.1 + Math.random() * 0.4
    const texture = textures[Math.floor(Math.random() * textures.length)]
    const radius = 0.5 + Math.random() 
    const color = new THREE.Color()
    color.setHSL(Math.random(), 1, 0.7)

    createFirework(count, position, size, texture, radius, color)
}

window.addEventListener('click', createRandomFirework)

/**
 * Sky
 */
const sky = new Sky()
sky.scale.setScalar(450000)
scene.add(sky)

const sun = new THREE.Vector3()

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.95,
    elevation: -2.2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );

}


gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();




/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()