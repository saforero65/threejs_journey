import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 15000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
const level = new Float32Array(count);

const radius = 5; // Define the radius of the sphere

for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const sphericalCoords = {
        radius: radius,
        phi: Math.random() * Math.PI * 2, // azimuthal angle
        theta: Math.acos((2 * Math.random()) - 1) // polar angle
    };

    positions[i3] = sphericalCoords.radius * Math.sin(sphericalCoords.theta) * Math.cos(sphericalCoords.phi); // x
    positions[i3 + 1] = sphericalCoords.radius * Math.sin(sphericalCoords.theta) * Math.sin(sphericalCoords.phi); // y
    positions[i3 + 2] = sphericalCoords.radius * Math.cos(sphericalCoords.theta); // z

    // Color
    colors[i3] = Math.random();
    colors[i3 + 1] = Math.random();
    colors[i3 + 2] = Math.random();
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

particlesGeometry.setAttribute('level', new THREE.BufferAttribute(level, 1));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.z = 3
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

// Create audio context and source
let audioContext;
let audioElement;
let audioSource;
let analyser;
let frequencyData;
const state = document.getElementById('state');

const initialPositions = positions.slice();

// Add a function to reset the positions
function resetPositions() {
    for (let i = 0; i < count * 3; i++) {
        particlesGeometry.attributes.position.array[i] = initialPositions[i];
    }
    particlesGeometry.attributes.position.needsUpdate = true;
}

function startAudio() {
    if (!audioContext) {
        // Initialize audio context and elements on first click
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioElement = new Audio('taliban-drill-type-beat-prod-5-x-beatz-prodte-201916.mp3');
        audioSource = audioContext.createMediaElementSource(audioElement);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        audioSource.connect(analyser);
        audioSource.connect(audioContext.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);

        audioElement.addEventListener('canplaythrough', () => {
            console.log('Audio is ready to play');
            audioElement.play().then(() => {
                console.log('Audio playback started successfully');
                state.innerHTML = 'Playing';
                tick();
            }).catch((error) => {
                console.error('Error starting audio playback:', error);
            });
        });
    } else {
        if (audioElement.paused) {
            audioElement.play().then(() => {
                console.log('Audio playback started successfully');
                state.innerHTML = 'Playing';
                tick();
            }).catch((error) => {
                console.error('Error starting audio playback:', error);
            });
        } else {
            audioElement.pause();
            state.innerHTML = 'Paused';
            console.log('Audio playback paused');
        }
    }
}

window.addEventListener('click', startAudio);

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    analyser.getByteFrequencyData(frequencyData);

    const bassFrequency = frequencyData[0]; // The first element corresponds to the bass

    // Update camera position
    const cameraSpeed = 0.2; // Adjust this to control the speed of the camera
    const cameraRadius = 8; // Adjust this to control the distance of the camera from the center

    // Move the camera in a circle around the center of the scene
    camera.position.x = Math.cos(elapsedTime * cameraSpeed) * cameraRadius;
    camera.position.z = Math.sin(elapsedTime * cameraSpeed) * cameraRadius;
    camera.position.y = Math.sin(elapsedTime * cameraSpeed) * cameraRadius;

    // Zoom in and out based on the bass frequency
    const zoomFactor = 1 + (bassFrequency / 256) * (0.2); // Adjust this factor to control the intensity of the zoom
    camera.position.multiplyScalar(zoomFactor);

    camera.lookAt(scene.position); // Make the camera always look at the center of the scene

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const x = initialPositions[i3];
        const y = initialPositions[i3 + 1];
        const z = initialPositions[i3 + 2];

        const normal = new THREE.Vector3(x, y, z).normalize();

        const frequencyIndex = Math.floor((i / count) * frequencyData.length); // Use the particle's index to determine the frequency
        const frequency = frequencyData[frequencyIndex];

        if (frequency > 0) {
            const displacement = Math.sin(frequency * elapsedTime) * 0.03; // Adjust this factor to control the speed
            particlesGeometry.attributes.position.array[i3] += normal.x * displacement;
            particlesGeometry.attributes.position.array[i3 + 1] += normal.y * displacement;
            particlesGeometry.attributes.position.array[i3 + 2] += normal.z * displacement;
        } else {
            particlesGeometry.attributes.position.array[i3] = x;
            particlesGeometry.attributes.position.array[i3 + 1] = y;
            particlesGeometry.attributes.position.array[i3 + 2] = z;
        }
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
