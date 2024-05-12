import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Group
const group = new THREE.Group()
scene.add(group)


/**
 * Objects
 */
const cube1 = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
group.add(cube1)

const cube2 = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
cube3.position.x = 2
group.add(cube3)

//Position
group.position.set(0, 1, 0)
group.scale.set(1, 2, 1)
group.rotation.set(0, 0, Math.PI * 0.25)

//Axes Helper
const axesHelper = new THREE.AxesHelper(2)

scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
camera.position.x = 1
scene.add(camera)
camera.lookAt(group.position)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)