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
renderer.setClearColor(0x04060b);
document.body.appendChild(renderer.domElement);

// TEXTURA DA LOGO
const textureLoader = new THREE.TextureLoader();
const eyeTexture = textureLoader.load('./olho.png');

// LOGO FIXA NO CENTRO
const eyeMaterial = new THREE.MeshBasicMaterial({
  map: eyeTexture,
  transparent: true
});

const eyeGeometry = new THREE.PlaneGeometry(2.2, 2.2);
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
scene.add(eye);

// ESTRELAS
const starCount = 1200;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 24;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 14;
  starPositions[i3 + 2] = (Math.random() - 0.5) * 10;
}

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.04,
  transparent: true,
  opacity: 0.85,
  sizeAttenuation: true,
  depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// CONTROLE
const input = { x: 0, y: 0 };

// MOUSE
window.addEventListener('mousemove', (event) => {
  input.x = (event.clientX / window.innerWidth) * 2 - 1;
  input.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// TOUCH
window.addEventListener(
  'touchmove',
  (event) => {
    const touch = event.touches[0];
    if (!touch) return;

    input.x = (touch.clientX / window.innerWidth) * 2 - 1;
    input.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  },
  { passive: true }
);

// ANIMAÇÃO
const ease = 0.08;

let starTargetRotX = 0;
let starTargetRotY = 0;
let starTargetPosX = 0;
let starTargetPosY = 0;

function animate() {
  // estrelas reagem ao input
  starTargetRotY = input.x * 0.35;
  starTargetRotX = input.y * 0.2;

  starTargetPosX = input.x * 0.4;
  starTargetPosY = input.y * 0.25;

  stars.rotation.y += (starTargetRotY - stars.rotation.y) * ease;
  stars.rotation.x += (starTargetRotX - stars.rotation.x) * ease;

  stars.position.x += (starTargetPosX - stars.position.x) * ease;
  stars.position.y += (starTargetPosY - stars.position.y) * ease;

  // leve movimento autônomo das estrelas
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0002;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});