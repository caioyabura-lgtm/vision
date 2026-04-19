document.body.style.margin = '0';
document.body.style.background = '#000';

const msg = document.createElement('div');
msg.textContent = 'Teste olho.png';
msg.style.position = 'fixed';
msg.style.top = '20px';
msg.style.left = '20px';
msg.style.color = 'white';
msg.style.fontSize = '28px';
document.body.appendChild(msg);

const img = document.createElement('img');
img.src = './olho.png';
img.style.width = '300px';
img.style.position = 'fixed';
img.style.left = '50%';
img.style.top = '50%';
img.style.transform = 'translate(-50%, -50%)';
img.style.border = '2px solid red';

img.onload = () => console.log('olho.png carregou');
img.onerror = () => console.log('ERRO ao carregar olho.png');

document.body.appendChild(img);