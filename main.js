document.body.style.background = 'red';

const msg = document.createElement('div');
msg.textContent = 'GitHub Pages atualizou';
msg.style.position = 'fixed';
msg.style.top = '30px';
msg.style.left = '30px';
msg.style.color = 'white';
msg.style.fontSize = '32px';
msg.style.zIndex = '9999';
document.body.appendChild(msg);