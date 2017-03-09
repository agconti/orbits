import React, { Component } from 'react'
import * as THREE from 'three'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.clock = new THREE.Clock()
    this.lightColors = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00]
    this.lightOrbitModifiers = [
      [0.7, 0.5, 0.3]
      , [0.3, 0.5, 0.7]
      , [0.7, 0.3, 0.5]
      , [0.5, 0.7, 0.3]
    ]

    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', this.onWindowResize.bind(this), false )
    this.camera.position.z = 100

    this.createLights()
    this.createGlobe()
  }
  componentDidMount() {
    this.container.appendChild(this.renderer.domElement)
    this.animate()
  }

  createLights() {
    const createLight = color => {
      const sphere = new THREE.SphereGeometry(0.5, 16, 8)
      const light = new THREE.PointLight(color, 2, 50)

      light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color })))
      return light
    }

    this.lights = this.lightColors.map(createLight)
    this.lights.forEach(light => this.scene.add(light))
    this.scene.add( new THREE.AmbientLight(0x222222))
  }
  createGlobe() {
    const globe = new THREE.SphereGeometry( 20, 16, 8 )
    this.scene.add(new THREE.Mesh(globe, new THREE.MeshLambertMaterial({ reflectivity: 0.8, color: 'white' })))
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.renderScene()
  }
  renderScene() {
    const time = Date.now() * 0.0005
    const delta = this.clock.getDelta()

    this.lights.forEach((light, index)=> {
      const [xMod, yMod, zMod] = this.lightOrbitModifiers[index]

      light.position.x = Math.sin( time * xMod ) * 40
      light.position.y = Math.cos( time * yMod ) * 50
      light.position.z = Math.cos( time * zMod ) * 40
    })
    this.renderer.render(this.scene, this.camera)
  }
  render() {
    return <div ref={el => this.container = el}></div>
  }
}

export default App
