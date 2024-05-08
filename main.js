import * as THREE from 'three'
import './style.css'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//Scene
const scene = new THREE.Scene();
//Create Geometry
const geometry = new THREE.SphereGeometry(3, 64, 64)
//Add Material to sphere
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5
})

//Size
const size = {
  width: window.innerWidth,
  height: window.innerHeight
}
//Combine geometry with material
const mesh = new THREE.Mesh(geometry, material)
//Add it to a scene
scene.add(mesh)

//light
const light = new THREE.PointLight(0xffffff, 90, 100, 1.7)
light.position.set(0, 10, 10)
light.intensity = 120
scene.add(light)
//Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
//to set smooth surface on edge side of sphere
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//orbit control moving light
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//disable dragging object in camera
controls.enablePan = false
//disable zooming
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//resize
window.addEventListener("resize", () => {
  size.width = window.innerWidth
  size.height = window.innerHeight
  //update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic
const t1 = gsap.timeline({ defaults: { duration: 1 } })
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
t1.fromTo("nav", { y: '-100%' }, { y: "0%" })
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 })

//mouse animation color
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => mouseDown = true)
window.addEventListener('mouseup', () => mouseDown = false)

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      150
    ]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b })
  }
})