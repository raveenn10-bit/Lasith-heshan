(() => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const modal = document.getElementById('gameModal');
  const overlay = document.getElementById('gameOverlay');
  const scoreEl = document.getElementById('gameScore');
  const bestEl = document.getElementById('gameBest');
  let frame = 0, score = 0, speed = 7, running = false, raf;
  let best = Number(localStorage.getItem('lasithRunBest') || 0);
  bestEl.textContent = String(best).padStart(4, '0');
  const player = {x:150,y:400,w:38,h:72,vy:0,grounded:true};
  let obstacles = [], bolts = [], stars = [];
  for(let i=0;i<65;i++) stars.push({x:Math.random()*960,y:Math.random()*330,r:Math.random()*2+.4,s:Math.random()*.5+.15});

  const reset = () => { frame=score=0; speed=7; obstacles=[]; bolts=[]; player.y=400; player.vy=0; player.grounded=true; scoreEl.textContent='0000'; };
  const start = () => { reset(); running=true; overlay.classList.add('hidden'); loop(); };
  const end = () => {
    running=false; cancelAnimationFrame(raf);
    if(score>best){best=score;localStorage.setItem('lasithRunBest',best);bestEl.textContent=String(best).padStart(4,'0');}
    overlay.innerHTML=`<h3>RUN ENDED</h3><p>Score ${String(score).padStart(4,'0')}</p><button id="restartGame" type="button">Run again</button>`;
    overlay.classList.remove('hidden'); document.getElementById('restartGame').onclick=start;
  };
  const jump = () => { if(running&&player.grounded){player.vy=-16;player.grounded=false;} };
  const collide = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  const drawCity = () => {
    const g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,'#230015');g.addColorStop(.7,'#09010d');g.addColorStop(1,'#020203');ctx.fillStyle=g;ctx.fillRect(0,0,960,540);
    ctx.fillStyle='#ff1748';stars.forEach(s=>{s.x-=s.s;if(s.x<0)s.x=960;ctx.globalAlpha=.25+s.r/5;ctx.fillRect(s.x,s.y,s.r,s.r)});ctx.globalAlpha=1;
    for(let i=0;i<13;i++){const x=i*90-(frame*speed*.12%90),h=80+(i%4)*35;ctx.fillStyle=i%2?'#140918':'#20091a';ctx.fillRect(x,360-h,68,h);ctx.fillStyle='rgba(255,20,70,.28)';for(let wy=300-h;wy<345;wy+=18)for(let wx=x+10;wx<x+60;wx+=18)ctx.fillRect(wx,wy,4,8)}
    ctx.fillStyle='#09090a';ctx.fillRect(0,472,960,68);ctx.strokeStyle='#6a0a28';ctx.lineWidth=2;for(let x=-(frame*speed%100);x<960;x+=100){ctx.beginPath();ctx.moveTo(x,540);ctx.lineTo(x+55,472);ctx.stroke()}
    ctx.strokeStyle='#ff1748';ctx.beginPath();ctx.moveTo(0,472);ctx.lineTo(960,472);ctx.stroke();
  };
  const drawPlayer = () => {
    ctx.save();ctx.translate(player.x,player.y);ctx.shadowBlur=18;ctx.shadowColor='#ff1748';
    ctx.fillStyle='#111';ctx.beginPath();ctx.arc(19,10,12,0,Math.PI*2);ctx.fill();ctx.fillRect(8,22,24,37);
    const swing=Math.sin(frame*.3)*10;ctx.lineWidth=9;ctx.lineCap='round';ctx.strokeStyle='#090909';ctx.beginPath();ctx.moveTo(13,55);ctx.lineTo(8+swing,70);ctx.stroke();ctx.beginPath();ctx.moveTo(27,55);ctx.lineTo(30-swing,70);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#f0ad84';ctx.fillRect(7,17,22,4);ctx.restore();
  };
  const loop = () => {
    if(!running)return;frame++;speed=Math.min(14,7+score/180);drawCity();
    player.vy+=.8;player.y+=player.vy;if(player.y>=400){player.y=400;player.vy=0;player.grounded=true;}
    if(frame%Math.max(65,Math.floor(110-speed*3))===0) obstacles.push({x:980,y:423,w:28+Math.random()*22,h:49});
    if(frame%145===0) bolts.push({x:980,y:330+Math.random()*70,w:22,h:32});
    obstacles.forEach(o=>o.x-=speed);bolts.forEach(b=>b.x-=speed);
    obstacles=obstacles.filter(o=>o.x>-60);bolts=bolts.filter(b=>b.x>-40&&!b.hit);
    ctx.fillStyle='#ef1747';obstacles.forEach(o=>{ctx.shadowBlur=15;ctx.shadowColor='#ff1748';ctx.fillRect(o.x,o.y,o.w,o.h);ctx.shadowBlur=0;if(collide(player,o))end();});
    bolts.forEach(b=>{ctx.fillStyle='#ffe45b';ctx.beginPath();ctx.moveTo(b.x+13,b.y);ctx.lineTo(b.x,b.y+19);ctx.lineTo(b.x+9,b.y+19);ctx.lineTo(b.x+4,b.y+32);ctx.lineTo(b.x+23,b.y+12);ctx.lineTo(b.x+14,b.y+12);ctx.closePath();ctx.fill();if(collide(player,b)){b.hit=true;score+=25;}});
    drawPlayer();if(frame%6===0){score++;scoreEl.textContent=String(score).padStart(4,'0');}raf=requestAnimationFrame(loop);
  };
  const open = () => {modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');};
  const close = () => {running=false;cancelAnimationFrame(raf);modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');overlay.classList.remove('hidden');};
  document.getElementById('launchGame').onclick=open;document.getElementById('closeGame').onclick=close;document.getElementById('startGame').onclick=start;document.getElementById('jumpButton').onclick=jump;
  canvas.addEventListener('pointerdown',jump);document.addEventListener('keydown',e=>{if(['Space','ArrowUp'].includes(e.code)){e.preventDefault();jump()}if(e.key==='Escape'&&modal.classList.contains('open'))close()});
  drawCity();drawPlayer();
})();
