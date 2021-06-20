import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
/**
 * BASE
 */
//Scene
const scene = new THREE.Scene();

//Canvas
const canvas = document.querySelector('.webgl');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
//Debug
const gui = new dat.GUI();

/**
 * Models
 */
const lightMap = new THREE.TextureLoader().load("/models/Office3D/Lightmap-0_comp_light.exr");

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// const fbxLoader = new FBXLoader();
// fbxLoader.load(
//     '/models/office.fbx',
//     (fbx) => {

//         console.log(fbx);
//         fbx.position.y = 0.1;
//         fbx.scale.set(0.025, 0.025, 0.025);
//         scene.add(fbx);

//     }
// );

let mixer = null;

gltfLoader.load(
    '/models/3D_Assets_Ahmed/3D_Assets_Ahmed 1.gltf',
    (gltf) => {

        gltf.scenes.forEach(obj => {
            console.log(obj);
        });
        // gltf.scene.position.y = 0.1;
        // gltf.scene.scale.set(0.01, 0.01, 0.01);
        // scene.add(gltf.scene);

    },
    () => {
        console.log("loading");
    }
)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 5, 5)
    // directionalLight.castShadow = true
    // directionalLight.shadow.mapSize.width = 1024
    // directionalLight.shadow.mapSize.height = 1024
    // directionalLight.shadow.camera.near = 0.001
    // directionalLight.shadow.camera.far = 20
    // directionalLight.shadow.camera.top = 20
    // directionalLight.shadow.camera.right = 20
    // directionalLight.shadow.camera.bottom = -20
    // directionalLight.shadow.camera.left = -20
    // directionalLight.shadow.radius = 5
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.DirectionalLightHelper(directionalLight, 0.3);
// directionalLightCameraHelper.visible = false
// scene.add(directionalLightCameraHelper)

//Objects
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera);

window.addEventListener('resize', () => {
    //Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    //Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap = true;

//DeltaTime
const clock = new THREE.Clock();
let previousTime = 0;
//Animation
const Animation = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //update camera

    //update Mixer
    mixer ? mixer.update(deltaTime) : null;
    //Update Controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(Animation);
};

Animation();