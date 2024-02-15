// IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PARAMETERS
let gui;
const parameters = {
    resolutionX: 6, // Set the resolution to 6 for a hexagon
    rotationX: 100
}

//-- SCENE VARIABLES
let scene;
let camera;
let renderer;
let container;
let control;
let ambientLight;
let directionalLight;

//-- GEOMETRY PARAMETERS
// Create an empty array for storing all the hexagons
let sceneHexagons = [];
let resX = parameters.resolutionX;
let rotX = parameters.rotationX;

// Function to remove an object from the scene
function removeObject(object) {
    scene.remove(object);
    object.geometry.dispose();
    object.material.dispose();
}

// GEOMETRY FUNCTIONS
function createHexagons() {
    for (let i = -90; i < resX; i++) {
        const geometry = new THREE.CircleGeometry(1, 6);
        
        // Mor ve sarı renkler
        const material = new THREE.MeshPhysicalMaterial({
            color: i % 2 === 0 ? 0x800080 : 0xFFFF00 // Mor ve sarı renkler
        });
        
        const hexagon = new THREE.Mesh(geometry, material);
        hexagon.position.set(i * 0, i * 0, 0);
        hexagon.name = "hexagon " + i;
        sceneHexagons.push(hexagon);
        scene.add(hexagon);
    }
}

function rotateHexagons() {
    sceneHexagons.forEach((element, index) => {
        let scene_hexagon = scene.getObjectByName(element.name);
        let rotationAmount = (index * (rotX / resX)) * (Math.PI / 180);
        let rotationMatrix = new THREE.Matrix4().makeRotationY(rotationAmount);
        scene_hexagon.applyMatrix4(rotationMatrix);
    });
}

function removeHexagons() {
    resX = parameters.resolutionX;
    rotX = parameters.rotationX;
    sceneHexagons.forEach(element => {
        let scene_hexagon = scene.getObjectByName(element.name);
        removeObject(scene_hexagon);
    });
    sceneHexagons = [];
}

// RESPONSIVE
function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

// ANIMATE AND RENDER
function animate() {
    requestAnimationFrame(animate);

    control.update();

    if (resX !== parameters.resolutionX || rotX !== parameters.rotationX) {
        removeHexagons();
        createHexagons();
        rotateHexagons();
    }

    renderer.render(scene, camera);
}

function main() {
   //CREATE SCENE AND CAMERA
scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Koyu gri renk

camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 100);
camera.position.set(10, 10, 10);

// LIGHTINGS
ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 5, 5);
directionalLight.target.position.set(-1, -1, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

    // GUI
    gui = new GUI;
    gui.add(parameters, 'resolutionX', 3, 10, 1); // Adjust the range for the hexagon
    gui.add(parameters, 'rotationX', 0, 180);

    // GEOMETRY INITIATION
    // Initiate first hexagons
    createHexagons();
    rotateHexagons();

    // RESPONSIVE WINDOW
    window.addEventListener('resize', handleResize);

    // CREATE A RENDERER
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container = document.querySelector('#threejs-container');
    container.append(renderer.domElement);

    // CREATE MOUSE CONTROL
    control = new OrbitControls(camera, renderer.domElement);

    // EXECUTE THE UPDATE
    animate();
}

// EXECUTE MAIN
main();