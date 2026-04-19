import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';

// ======================
// CENA / CÂMERA / RENDER
// ======================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x04060b);
document.body.appendChild(renderer.domElement);

// ======================
// LOGO CENTRAL
// ======================
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('./logo.png');

const logoGroup = new THREE.Group();
scene.add(logoGroup);

const glowGeometry = new THREE.PlaneGeometry(3.0, 3.0);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0x88aaff,
  transparent: true,
  opacity: 0.14,
  depthWrite: false
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.z = -0.05;
logoGroup.add(glow);

const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true
});
const logoGeometry = new THREE.PlaneGeometry(2.2, 2.2);
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logoGroup.add(logo);

// ======================
// ESTRELAS
// ======================
const starCount = 1400;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 28;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 18;
  starPositions[i3 + 2] = -Math.random() * 18;
}

starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.045,
  transparent: true,
  opacity: 0.85,
  sizeAttenuation: true,
  depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ======================
// CONTROLES
// ======================
const input = {
  x: 0, // -1 a 1
  y: 0  // -1 a 1
};

// fallback desktop
window.addEventListener('mousemove', (event) => {
  input.x = (event.clientX / window.innerWidth) * 2 - 1;
  input.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// mobile orientation
function handleOrientation(event) {
  // beta: frente/trás, gamma: esquerda/direita
  const beta = event.beta ?? 0;
  const gamma = event.gamma ?? 0;

  // limitar para controle suave
  const clampedGamma = Math.max(-30, Math.min(30, gamma));
  const clampedBeta = Math.max(-30, Math.min(30, beta));

  input.x = clampedGamma / 30;
  input.y = -(clampedBeta / 30);
}

function enableOrientationListener() {
  window.addEventListener('deviceorientation', handleOrientation, true);
}

async function requestSensorPermissionIfNeeded() {
  const button = document.getElementById('startSensors');

  try {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') {
        enableOrientationListener();
        button.style.display = 'none';
      } else {
        button.textContent = 'Permissão negada';
      }
    } else {
      enableOrientationListener();
      button.style.display = 'none';
    }
  } catch (err) {
    console.error('Erro ao ativar sensores:', err);
    button.textContent = 'Erro ao ativar';
  }
}

document
  .getElementById('startSensors')
  .addEventListener('click', requestSensorPermissionIfNeeded);

// ======================
// ANIMAÇÃO
// ======================
const ease = 0.06;

let logoTargetX = 0;
let logoTargetY = 0;
let logoTargetRotation = 0;
let logoTargetScale = 1;

function animate(time) {
  const t = time * 0.001;

  // logo reage ao aparelho / mouse
  logoTargetX = input.x * 0.35;
  logoTargetY = input.y * 0.22;
  logoTargetRotation = input.x * 0.18