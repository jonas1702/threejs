import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/* create a scene */
const scene =  new THREE.Scene()

const sizes = {
    width: 750,
    height: 500
}

/* animation */
let mixer     // Three.JS AnimationMixer
let Player_anim_IDLE   // Animation IDL

function loadAnim(file) {
    const loader = new GLTFLoader()

    loader.load(file, function ( glb ) {

        const monkey = glb.scene
        scene.add(monkey) 
        mixer = new THREE.AnimationMixer(monkey)
        Player_anim_IDLE = glb.animations[0]
        mixer.clipAction(Player_anim_IDLE).play();

    }, undefined, function ( error ) {

        console.error( error )

    } );
}

function loadstatic(file) {
    const loader = new GLTFLoader()
    loader.load(file, function ( glb ) {

        const monkey = glb.scene
        scene.add(monkey)

    }, undefined, function ( error ) {

        console.error( error )

    } );
}

function defaultResize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height )
}

/* create a camera, set perspective and aspect ratio and create light */
const camera = new THREE.PerspectiveCamera( 15, sizes.width / sizes.height, 0.1, 1000 )
camera.position.z = 20
scene.add(camera)

const light1 = new THREE.PointLight('#FF9000', 10, 100)
light1.position.set(30, 15, 3) /*x,y,,z*/
scene.add(light1)

const light2 = new THREE.PointLight('#546aff', 10, 70)
light2.position.set(-30, 15, 3)
scene.add(light2)

const light3 = new THREE.PointLight('#fff', 5, 20)
light3.position.set(5, 10, 5)
scene.add(light3)



/* renderer */
const renderer = new THREE.WebGLRenderer()

renderer.setSize(sizes.width, sizes.height, 0.1, 100 )
renderer.setClearColor('#eaeaea')

/* canvas */
const main = document.querySelector('.main')
const newcanvas = main.appendChild( renderer.domElement )

newcanvas.classList.add('canvas')

renderer.render(scene, camera)

let page = document.body.id
switch (page) {

    case 'monkeyAnim':
        loadAnim('./monkeyAnim.glb')
        /* resizeing */
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 900) {
                defaultResize()
            } else {
                sizes.width = 750
                sizes.height = 500

                camera.aspect = 750 / 500
                camera.updateProjectionMatrix()
                renderer.setSize(sizes.width, sizes.height)
            }
            
        })
        // const controlsAnim = new OrbitControls(camera, newcanvas)
        // controlsAnim.enableDamping = true
        // controlsAnim.enablePan = false
        // controlsAnim.enableZoom = false
        break

    case 'monkeyScroll':
        loadstatic('./monkey.glb')
        defaultResize()
        window.addEventListener('resize', () => {
            defaultResize()
        })

        const controlsScroll = new OrbitControls(camera, newcanvas)
        controlsScroll.enableDamping = true
        controlsScroll.enablePan = false
        controlsScroll.enableZoom = false
        // controlsScroll.autoRotate = true
        // controlsScroll.autoRotateSpeed = 5
        break

    default:
        console.log('error')
        break

}

/* animation loop */
const clock = new THREE.Clock()

const loop = () => {
	requestAnimationFrame( loop )
    /* calls animation if model has loaded */
    if (mixer) {
        mixer.update(clock.getDelta() / 8)
    }

	renderer.render( scene, camera )

}
loop();