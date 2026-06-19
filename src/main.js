import "./style.scss";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const canvas = document.querySelector("#experience-canvas");
const sizes ={
  zoom_out:  1.5,
  zoom_in: 0.5,
  width: window.innerWidth,
  height: window.innerHeight,
  switchSize: false 
}

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x66c0ff);
const camera = new THREE.PerspectiveCamera( 
  75, 
  sizes.width / sizes.height, 
  0.1,
  100000
);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 100;


const loader = new GLTFLoader();
loader.load('./models/exportThreejsNoOutlines.gltf', (gltf) => {
  const appartment = gltf.scene;
  scene.add(appartment);
});

const light = new THREE.AmbientLight( 0x404040, 100 ); // soft white light
scene.add( light );

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );

// Event Listeners & Functions 

const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();
function animate() {
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

document.body.addEventListener("keypress", (event)=> {
  if(event.key=="q" || event.key=="Q")
  {
    pauseMenu();
  }
})

const pauseMenu = () =>{
  console.log("boop");
  sizes.width = window.innerWidth/sizes.zoom_out;
  sizes.height = window.innerHeight/sizes.zoom_out;
  sizes.switchSize = !sizes.switchSize;
  resizeWindow();
}

window.addEventListener("resize", ()=>{
  resizeWindow();
})

const resizeWindow = () =>{
  if (sizes.switchSize)
  {
    sizes.width = window.innerWidth/sizes.zoom_out;
    sizes.height = window.innerHeight/sizes.zoom_out;
  }
  else
  {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Updater renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

const effect = new OutlineEffect( renderer);

const render = () =>{
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  
  renderer.render( scene, camera );
  effect.render( scene, camera );
  window.requestAnimationFrame(render);
}

render();