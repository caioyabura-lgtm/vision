import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';

// ======================
// CENA
// ======================
const scene = new THREE.Scene();

// ======================
// CÂMERA
// ======================
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cameraBaseZ = 5;
camera.position.z = cameraBaseZ;

let cameraTargetX = 0;
let cameraTargetY = 0;

// ======================
// RENDER
// ======================
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setClearColor(0x04060b);
document.body.appendChild(renderer.domElement);

// ======================
// TEXTURA DO OLHO
// ======================
const textureLoader = new THREE.TextureLoader();
const eyeTexture = textureLoader.load('./olho.png');

// ======================
// LOGO FIXA
// ======================
const eyeMaterial = new THREE.MeshBasicMaterial({
  map: eyeTexture,
  color: 0xffffff, // pode trocar depois
  transparent: true
});

const eyeGeometry = new THREE.PlaneGeometry(2.2, 2.2);
const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
scene.add(eye);

// ======================
// CAMADAS DE ESTRELAS
// ======================
function createStarField(count, spreadX, spreadY, spreadZ, size, opacity) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spreadX;
    positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

// menos estrelas, mas em camadas
const starsBack = createStarField(200, 28, 16, 18, 0.03, 0.35);
const starsMid = createStarField(180, 22, 14, 12, 0.045, 0.55);
const starsFront = createStarField(120, 16, 10, 8, 0.07, 0.9);

// ======================
// INPUT
// ======================
const input = { x: 0, y: 0 };

// mouse
window.addEventListener('mousemove', (event) => {
  input.x = (event.clientX / window.innerWidth) * 2 - 1;
  input.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// touch
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

// ======================
// PARÂMETROS
// ======================
const ease = 0.09;

let backTargetRotX = 0;
let backTargetRotY = 0;
let midTargetRotX = 0;
let midTargetRotY = 0;
let frontTargetRotX = 0;
let frontTargetRotY = 0;

let backTargetPosX = 0;
let backTargetPosY = 0;
let midTargetPosX = 0;
let midTargetPosY = 0;
let frontTargetPosX = 0;
let frontTargetPosY = 0;

// ======================
// ANIMAÇÃO
// ======================
function animate(time) {
  const t = time * 0.001;

  // ----------------------
  // estrelas em paralaxe
  // ----------------------
  backTargetRotY = input.x * 0.10;
  backTargetRotX = input.y * 0.06;
  backTargetPosX = input.x * 0.10;
  backTargetPosY = input.y * 0.06;

  midTargetRotY = input.x * 0.22;
  midTargetRotX = input.y * 0.12;
  midTargetPosX = input.x * 0.22;
  midTargetPosY = input.y * 0.12;

  frontTargetRotY = input.x * 0.38;
  frontTargetRotX = input.y * 0.22;
  frontTargetPosX = input.x * 0.42;
  frontTargetPosY = input.y * 0.22;

  starsBack.rotation.y += (backTargetRotY - starsBack.rotation.y) * ease;
  starsBack.rotation.x += (backTargetRotX - starsBack.rotation.x) * ease;
  starsBack.position.x += (backTargetPosX - starsBack.position.x) * ease;
  starsBack.position.y += (backTargetPosY - starsBack.position.y) * ease;

  starsMid.rotation.y += (midTargetRotY - starsMid.rotation.y) * ease;
  starsMid.rotation.x += (midTargetRotX - starsMid.rotation.x) * ease;
  starsMid.position.x += (midTargetPosX - starsMid.position.x) * ease;
  starsMid.position.y += (midTargetPosY - starsMid.position.y) * ease;

  starsFront.rotation.y += (frontTargetRotY - starsFront.rotation.y) * ease;
  starsFront.rotation.x += (frontTargetRotX - starsFront.rotation.x) * ease;
  starsFront.position.x += (frontTargetPosX - starsFront.position.x) * ease;
  starsFront.position.y += (frontTargetPosY - starsFront.position.y) * ease;

  // movimento autônomo sutil
  starsBack.rotation.y += 0.00015;
  starsMid.rotation.y += 0.00035;
  starsFront.rotation.y += 0.0007;

  // "piscar" delicado por camada
  starsBack.material.opacity = 0.30 + Math.sin(t * 1.2) * 0.04;
  starsMid.material.opacity = 0.52 + Math.sin(t * 1.6) * 0.05;
  starsFront.material.opacity = 0.85 + Math.sin(t * 2.0) * 0.06;

  // ----------------------
  // câmera viva, sutil
  // ----------------------
  cameraTargetX = input.x * 0.12;
  cameraTargetY = input.y * 0.08;

  camera.position.x += (cameraTargetX - camera.position.x) * 0.04;
  camera.position.y += (cameraTargetY - camera.position.y) * 0.04;
  camera.position.z = cameraBaseZ + Math.sin(t * 0.5) * 0.05;

  camera.lookAt(0, 0, 0);

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