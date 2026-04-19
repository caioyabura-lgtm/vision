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

// LOGO
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('./logo.png');

const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true
});

const logoGeometry = new THREE.PlaneGeometry(2.2, 2.2);
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
scene.add(logo);

// GLOW
const glowGeometry = new THREE.PlaneGeometry(3.2, 3.2);
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0x88aaff,
  transparent: true,
  opacity: 0.12,
  depthWrite: false
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.z = -0.05;
scene.add(glow);

// ESTRELAS
const starCount = 1200;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 28;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 18;
  starPositions[i3 + 2] = (Math.random() - 0.5) * 12;
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
const input = {
  x: 0,
  y: 0
};

// MOUSE
window.addEventListener('mousemove', (event) => {
  input.x = (event.clientX / window.innerWidth) * 2 - 1;
  input.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// TOUCH
window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (!touch) return;

  input.x = (touch.clientX / window.innerWidth) * 2 - 1;
  input.y = -(touch.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

// ANIMAÇÃO
const ease = 0.05;

let targetX = 0;
let targetY = 0;
let targetRot = 0;
let targetScale = 1;

function animate(time) {
  const t = time * 0.001;

  targetX = input.x * 0.35;
  targetY = input.y * 0.2;
  targetRot = input.x * 0.15;
  targetScale = 1 + Math.abs(input.x) * 0.06;

  logo.position.x += (targetX - logo.position.x) * ease;
  logo.position.y += (targetY - logo.position.y) * ease;
  logo.rotation.z += (targetRot - logo.rotation.z) * ease;
  logo.scale.x += (targetScale - logo.scale.x) * ease;
  logo.scale.y += (targetScale - logo.scale.y) * ease;

  glow.position.x = logo.position.x;
  glow.position.y = logo.position.y;
  glow.rotation.z = logo.rotation.z;
  glow.scale.x = logo.scale.x * (1 + Math.sin(t * 1.3) * 0.03);
  glow.scale.y = logo.scale.y * (1 + Math.sin(t * 1.3) * 0.03);
  glow.material.opacity = 0.1 + Math.sin(t * 1.4) * 0.02;

  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.0002;
  stars.rotation.y += input.x * 0.001;
  stars.rotation.x += input.y * 0.0007;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});