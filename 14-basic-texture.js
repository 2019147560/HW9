import * as THREE from 'three';  
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initRenderer, initCamera, initStats, initOrbitControls, 
         initDefaultLighting, addLargeGroundPlane, addGeometry } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(0, 0, 0));
let perpectiveorothographic = 'perspective';
 if(perpectiveorothographic == 'perspective'){camera = initCamera(new THREE.Vector3(0, 0, 100));} 
 else{
   camera = initCamera(new THREE.Vector3(0, 0, 100), { type: 'orthographic', frustumSize: 80 });
   };

   camera.lookAt(0,0,0);
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//
//const aspect = window.innerWidth / window.innerHeight;
//const frustumSize = 100;
// const camera = new THREE.OrthographicCamera(
//   -frustumSize * aspect / 2,  // left
//    frustumSize * aspect / 2,  // right
//    frustumSize / 2,           // top
//   -frustumSize / 2,           // bottom
//   0.01, 10000000                   // near, far
// );
//camera.position.copy(initialPosition);

let orbitControls = initOrbitControls(camera, renderer);
const stats = initStats();

let time1 = 0;
let rs1 = 0.02;
let rs2 = 0.015;
let rs3 = 0.01;
let rs4 = 0.008;
let os1 = 0.02;
let os2 = 0.015;
let os3 = 0.01;
let os4 = 0.008;


const params = {
    rs1: rs1,     // 각도(도 단위)
    os1: os1     // 공전 반지름
};
const params2 = { rs2: rs2,     // 각도(도 단위)
    os2: os2}
    const params3 = { rs3: rs3,     // 각도(도 단위)
    os3: os3}
    const params4 = { rs4: rs4,     // 각도(도 단위)
    os4: os4}
const gui = new GUI();
const f1 = gui.addFolder('Mercury');
const f2 = gui.addFolder('Venus');
const f3 = gui.addFolder('Earth');
const f4 = gui.addFolder('Mars');
const r1control = f1.add(params, 'rs1', 0, 1, 0.01).name('Rotation Speed');
r1control.onChange( v => { rs1 = v; });
const o1control = f1.add(params, 'os1', 0, 1, 0.01).name('Orbit Speed');
o1control.onChange( v => { os1 = v; });
const r2control = f2.add(params2, 'rs2', 0, 1, 0.01).name('Rotation Speed');
r2control.onChange( v => { rs2 = v; });
const o2control= f2.add(params2, 'os2', 0, 1, 0.01).name('Orbit speed');
o2control.onChange( v => { os2 = v; });
const r3control = f3.add(params3, 'rs3', 0, 1, 0.01).name('Rotation Speed');
r3control.onChange( v => { rs3 = v; });
const o3control = f3.add(params3, 'os3', 0, 1, 0.01).name('Orbit Speed');
o3control.onChange( v => { os3 = v; });
const r4control = f4.add(params4, 'rs4', 0, 1, 0.01).name('Rotation Speed');
r4control.onChange( v => { rs4 = v; });
const o4control= f4.add(params4, 'os4', 0, 1, 0.01).name('Orbit speed');
o4control.onChange( v => { os4 = v; });


const groundPlane = addLargeGroundPlane(scene);

// helper to apply camera mode (recreates camera and orbit controls)
function applyCameraMode(mode) {
  if (mode === 'perspective') {
    camera = initCamera(new THREE.Vector3(0, 0, 100));
  } else {
    camera = initCamera(new THREE.Vector3(0, 0, 100), { type: 'orthographic', frustumSize: 80 });
  }
  camera.lookAt(0, 0, 0);

  // recreate orbit controls bound to new camera
  if (orbitControls) orbitControls.dispose();
  orbitControls = initOrbitControls(camera, renderer);
}

let cameraModeCtrl;
const paramscamera = {
  cameraMode: 'perspective',
  toggleCamera() {
    this.cameraMode = this.cameraMode === 'perspective' ? 'orthographic' : 'perspective';
    applyCameraMode(this.cameraMode);
    perpectiveorothographic = this.cameraMode; // keep legacy variable in sync
    if (cameraModeCtrl) cameraModeCtrl.setValue(this.cameraMode);
  }
};

gui.add(paramscamera, 'toggleCamera').name('Toggle Camera');
// show the current cameraMode as a read-only display (no dropdown)
cameraModeCtrl = gui.add(paramscamera, 'cameraMode').name('Camera Mode');
// disable user input to make it display-only
const cameraModeInput = cameraModeCtrl.domElement.querySelector('input');
if (cameraModeInput) cameraModeInput.disabled = true;

// Remove the large XZ ground plane (was appearing as a gray plane);
// if you prefer to keep it but hide it visually, set groundPlane.visible = false instead.
scene.remove(groundPlane);

// keep properties in case you choose to re-add later
groundPlane.position.y = 0;
groundPlane.receiveShadow = true;
// Replace the default lighting with a simple frontal directional light
// positioned roughly in front of the camera and pointing at the scene center.
const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
// place it in front of the camera (camera is at 0,20,40)
frontLight.position.set(0, 20, 60);
frontLight.target.position.set(0, 0, 0);
frontLight.castShadow = true;
frontLight.shadow.mapSize.set(2048, 2048);
frontLight.shadow.camera.near = 0.5;
frontLight.shadow.camera.far = 200;
frontLight.shadow.camera.left = -50;
frontLight.shadow.camera.right = 50;
frontLight.shadow.camera.top = 50;
frontLight.shadow.camera.bottom = -50;
scene.add(frontLight);
scene.add(frontLight.target);
// a small ambient fill so shadows aren't fully black
scene.add(new THREE.AmbientLight(0x222222));

const textureLoader = new THREE.TextureLoader();


const sphereGeometry5 = new THREE.SphereGeometry(2.5, 20, 20);
// // texture 적용, addGeometry 함수는 util.js에 정의되어 있음
  const sphere5 = addGeometry(scene, sphereGeometry5, 
                         textureLoader.load('./assets/textures/metal-rust.jpg'));
const sphereMesh5 = addGeometry(scene, sphereGeometry5,
                          textureLoader.load('./Mars.jpg'));                         
// const sphere3 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
//  sphere5.position.x = 0;
//  sphere5.castShadow = true;
 scene.add(sphereMesh5);

const sphereGeometry4 = new THREE.SphereGeometry(3.5, 20, 20);
// // texture 적용, addGeometry 함수는 util.js에 정의되어 있음
  const sphere4 = addGeometry(scene, sphereGeometry4, 
                         textureLoader.load('./assets/textures/metal-rust.jpg'));
const sphereMesh4 = addGeometry(scene, sphereGeometry4,
                          textureLoader.load('./Earth.jpg'));
// const sphere3 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
//  sphere4.position.x = 0;
//  sphere4.castShadow = true;
 scene.add(sphereMesh4);

// Icosahedron: 정 20면체, 8은 radius, 0은 detail level 
// detail level: 0은 default, 1은 더 많은 면, 2는 더 많은 면 (삼각형을 4개로 계속 나누어 감)
const sphereGeometry3 = new THREE.SphereGeometry(3, 20, 20);
// // texture 적용, addGeometry 함수는 util.js에 정의되어 있음
  //const sphere3 = addGeometry(scene, sphereGeometry3, 
   //                      textureLoader.load('./assets/textures/metal-rust.jpg'));
// const sphere3 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
const sphereMesh3 = addGeometry(scene, sphereGeometry3,
                          textureLoader.load('./Venus.jpg'));
 //sphere3.position.x = 0;
 sphereMesh3.castShadow = true;
 scene.add(sphereMesh3);

const sphereGeometry2 = new THREE.SphereGeometry(1.5, 20, 20);
const sphereMaterial2 = new THREE.MeshStandardMaterial({color: 0x7777ff});
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
const sphereMesh2 = addGeometry(scene, sphereGeometry2,
                          textureLoader.load('./Mercury.jpg'));
sphereMesh2.name = 'sphere2';
// position the sphere
sphereMesh2.position.x = 0;
// sphere2.position.y = 4;
// sphere2.position.z = 2;
sphereMesh2.castShadow = true;
// add the sphere to the scene
scene.add(sphereMesh2);



// Sphere: 반지름 5, 20는 가로 세로 분할 수
const sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
// Use a bright, fully-flat yellow material with no lighting (MeshBasicMaterial)
// MeshBasicMaterial ignores lights so there will be no shading/gradient.
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // fully bright yellow, no gradient
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.castShadow = true;
// position and add to scene
sphereMesh.position.set(0, 0, 0);
scene.add(sphereMesh);

// // Cube: 가로, 세로, 높이 10
// const cube = new THREE.BoxGeometry(10, 10, 10)
// const cubeMesh = addGeometry(scene, cube,
//                         textureLoader.load('./assets/textures/brick-wall.jpg'));
// cubeMesh.position.x = -20;
// cubeMesh.castShadow = true;

render();

function render() {
  stats.update();
  orbitControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  // polyhedronMesh.rotation.x += 0.01;
  // polyhedronMesh.position.x -= 0.01;
  time1 += 1;
  sphereMesh2.position.x = 0+ Math.sin(time1*os1)*20;
  sphereMesh2.position.z = 0+Math.cos(time1*os1)*20;
    sphereMesh3.position.x = 0+ Math.sin(time1*os2)*35;
  sphereMesh3.position.z = 0+Math.cos(time1*os2)*35;
    sphereMesh4.position.x = 0+ Math.sin(time1*os3)*50;
  sphereMesh4.position.z = 0+Math.cos(time1*os3)*50;
    sphereMesh5.position.x = 0+ Math.sin(time1*os4)*65;
    sphereMesh5.position.z = 0+ Math.cos(time1*os4)*65;

  //sphereMesh.rotation.y += 0.01;
  sphereMesh2.rotation.y += rs1;
  sphereMesh3.rotation.y += rs2;
  sphereMesh4.rotation.y += rs3;
  sphereMesh5.rotation.y += rs4;

  
  
}

