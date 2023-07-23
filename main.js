import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/* create a scene */
const scene =  new THREE.Scene()

/* animation */
let mixer     // Three.JS AnimationMixer
let Player_anim_IDLE   // Animation IDL

const loader = new GLTFLoader()

loader.load( './monkeyAnim.glb', function ( glb ) {

    const monkey = glb.scene
    scene.add(monkey) 
    mixer = new THREE.AnimationMixer(monkey)
    Player_anim_IDLE = glb.animations[0]
    mixer.clipAction(Player_anim_IDLE).play();

}, undefined, function ( error ) {

	console.error( error )

} );

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// const geometry = new THREE.PlaneGeometry( 10, 10 );
// geometry.rotateZ(180)
// const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );
// scene.add( plane );
// plane.position.y = 0

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

/* resizeing */
window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height )
    } else {
        sizes.width = 500
        sizes.height = 750

        camera.aspect = 500 / 750
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height )
    }
    
})

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