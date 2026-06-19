import "./style.scss";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

let CameraPosition1 = new THREE.Vector3(3.499, 33.030, -8.456);

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
  0.001,
  100000
);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const loader = new GLTFLoader();
loader.load('./models/exportThreejsFinal.gltf', (gltf) => {
  const appartment = gltf.scene;
  appartment.position.set(0, 0, 0); 
  appartment.rotation.y = Math.PI;
  for(const child of appartment.children)
  {
    child.castShadow = true;
    child.receiveShadow = true;
    for(const kid of child.children)
    {
      kid.castShadow = true;
      kid.receiveShadow = true;
    }
  }
  appartment.castShadow = true;
  console.log(appartment);
  scene.add(appartment);
});

const light = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLight.position.set(  1, 1.75,  1 );
directionalLight.color.setHSL( 0.1, 1, 0.95 );
directionalLight.position.multiplyScalar( 30 );
scene.add( directionalLight );

directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height= 2048;

const d = 50;

directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;

directionalLight.shadow.camera.far = 3500;
directionalLight.shadow.bias = - 0.0001;

const dirLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10 );
scene.add( dirLightHelper );

// Event Listeners & Functions 

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform
// camera.position.set( 0, 20, 100 );
camera.position.set(-8, 25, 17);
camera.rotation.x = THREE.MathUtils.degToRad(0);
camera.rotation.y = THREE.MathUtils.degToRad(0);
camera.rotation.z = THREE.MathUtils.degToRad(0);

// controls.update();

function animate() {
	// required if controls.enableDamping or controls.autoRotate are set to true
	// controls.update();
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

const effect = new OutlineEffect( renderer, { defaultThickness: 0.006});

const render = () =>{

  renderer.render( scene, camera );
  effect.render( scene, camera );
  window.requestAnimationFrame(render);
}

render();