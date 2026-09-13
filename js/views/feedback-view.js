/* VIEW: toast messages + confetti celebration effects. */

function showToast(message){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  document.getElementById('toast-layer').appendChild(t);
  setTimeout(()=>t.remove(), 3500);
}
function spawnConfetti(color, count){
  const layer = document.getElementById('confetti-layer');
  const palette = [color, 'var(--gold)', 'var(--kraft)', 'var(--stamp)'];
  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = 5 + Math.random()*5;
    el.style.left = (Math.random()*100)+'vw';
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.background = palette[Math.floor(Math.random()*palette.length)];
    el.style.borderRadius = (Math.random()>0.5 ? '50%' : '2px');
    el.style.animationDuration = (1.6 + Math.random()*1.2)+'s';
    layer.appendChild(el);
    setTimeout(()=>el.remove(), 3200);
  }
}
function celebrate(message, color, confettiCount){
  showToast(message);
  spawnConfetti(color, confettiCount);
}
