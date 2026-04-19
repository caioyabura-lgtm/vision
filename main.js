import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';

// CENA
const scene = new THREE.Scene();

// CÂMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x06080d);
document.body.appendChild(renderer.domElement);

// ======================
// LOGO CENTRAL
// ======================
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('./olho.png');

const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true
});

const logoGeometry = new THREE.PlaneGeometry(2.2, 2.2);
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
scene.add(logo);

// ======================
// CAMPO DE ESTRELAS
// ======================
const starCount = 800;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;

  starPositions[i3] = (Math.random() - 0.5) * 20;      // x
  starPositions[i3 + 1] = (Math.random() - 0.5) * 12;  // y
  starPositions[i3 + 2] = (Math.random() - 0.5) * 10;  // z
}

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.035,
  sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ======================
// MOUSE
// ======================
const mouse = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ======================
// PARÂMETROS
// ======================
const ease = 0.05;

let logoTargetX = 0;
let logoTargetY = 0;
let logoTargetRotation = 0;
let logoTargetScale = 1;

// ======================
// ANIMAÇÃO
// ======================
function animate() {
  // Logo responde ao mouse
  logoTargetX = mouse.x * 0.35;
  logoTargetY = mouse.y * 0.2;
  logoTargetRotation = mouse.x * 0.15;
  logoTargetScale = 1 + Math.abs(mouse.x) * 0.08;

  logo.position.x += (logoTargetX - logo.position.x) * ease;
  logo.position.y += (logoTargetY - logo.position.y) * ease;
  logo.rotation.z += (logoTargetRotation - logo.rotation.z) * ease;

  logo.scale.x += (logoTargetScale - logo.scale.x) * ease;
  logo.scale.y += (logoTargetScale - logo.scale.y) * ease;

  // Movimento sutil do campo de estrelas
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  // Parallax com mouse
  stars.rotation.y += (mouse.x * 0.003);
  stars.rotation.x += (mouse.y * 0.002);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// ======================
// RESIZE
// ======================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});