import gsap from 'gsap';
import * as THREE from 'three';

console.log(gsap);
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// const clock = new THREE.Clock()
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

//Animations
const tick = () => {
    //Clock
    // const elapsedTime = clock.getElapsedTime()
   
    // // Update objects
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    // mesh.rotation.x = elapsedTime
    // mesh.rotation.y = elapsedTime
    // mesh.scale.set( Math.sin(elapsedTime), Math.sin(elapsedTime), Math.sin(elapsedTime))
    
    // //camera
    // camera.lookAt(mesh.position)

    //Render
    renderer.render(scene, camera)

    //Call tick again on the next frame
    window.requestAnimationFrame(tick)

}
tick()

