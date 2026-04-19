document.body.style.margin = '0';
document.body.style.background = '#111';

const img = document.createElement('img');
img.src = './logo.png';
img.style.width = '300px';
img.style.position = 'fixed';
img.style.left = '50%';
img.style.top = '50%';
img.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(img);

const msg = document.createElement('div');
msg.textContent = 'Teste logo.png';
msg.style.position = 'fixed';
msg.style.top = '20px';
msg.style.left = '20px';
msg.style.color = 'white';
msg.style.fontSize = '24px';
document.body.appendChild(msg);