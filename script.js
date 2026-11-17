(() => {
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  addEventListener('load',()=>setTimeout(()=>$('#preloader')?.classList.add('done'),320));

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px'});
  $$('.reveal').forEach(el=>observer.observe(el));

  const menu=$('#menu'), menuButton=$('.menu-button');
  const setMenu=open=>{menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));menuButton.setAttribute('aria-expanded',String(open));document.body.classList.toggle('locked',open)};
  menuButton.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  if(matchMedia('(pointer:fine)').matches){
    const blob=document.body.appendChild(document.createElement('div'));blob.className='pointer-blob';let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const follow=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;blob.style.left=x+'px';blob.style.top=y+'px';requestAnimationFrame(follow)};follow();
    $$('a,button,input,select,textarea,.archive-card,.stage-card').forEach(el=>{el.addEventListener('mouseenter',()=>blob.classList.add('hot'));el.addEventListener('mouseleave',()=>blob.classList.remove('hot'))});
  }

  const deck=$('#swipeDeck');let startX=0,dragging=false,paused=false;
  const shift=dir=>{if(paused)return;deck.classList.remove('shift-left','shift-right');requestAnimationFrame(()=>deck.classList.add(dir<0?'shift-left':'shift-right'));setTimeout(()=>deck.classList.remove('shift-left','shift-right'),850)};
  deck.addEventListener('pointerdown',e=>{startX=e.clientX;dragging=true;deck.setPointerCapture(e.pointerId)});
  deck.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const d=e.clientX-startX;if(Math.abs(d)>35)shift(d)});
  $('#swipeControl').addEventListener('click',()=>shift(Math.random()>.5?1:-1));
  $('#deckPause').addEventListener('click',e=>{e.stopPropagation();paused=!paused;e.currentTarget.textContent=paused?'▶':'Ⅱ';e.currentTarget.setAttribute('aria-label',paused?'Resume card motion':'Pause card motion')});

  $('.language').addEventListener('click',e=>{e.currentTarget.textContent=e.currentTarget.textContent==='EN'?'SI':'EN'});
  $('.theme-button').addEventListener('click',e=>{document.documentElement.classList.toggle('extra-soft');e.currentTarget.animate([{transform:'rotate(0)'},{transform:'rotate(180deg)'}],{duration:450})});

  let ctx,osc,gain;const sound=$('.sound-orb');
  sound.addEventListener('click',()=>{const on=sound.dataset.on==='1';sound.dataset.on=on?'0':'1';sound.textContent=on?'◖':'◉';if(!on){ctx||=new(AudioContext||webkitAudioContext)();osc=ctx.createOscillator();gain=ctx.createGain();osc.type='sine';osc.frequency.value=68;gain.gain.value=.012;osc.connect(gain).connect(ctx.destination);osc.start()}else if(osc){osc.stop();osc=null}});

  const assistant=$('#assistant'), assistantButton=$('#assistantButton');
  const setAssistant=open=>{assistant.classList.toggle('open',open);assistant.setAttribute('aria-hidden',String(!open));assistantButton.setAttribute('aria-expanded',String(open))};
  assistantButton.addEventListener('click',()=>setAssistant(!assistant.classList.contains('open')));$('#assistantClose').addEventListener('click',()=>setAssistant(false));
  const answers={work:'Use the booking form below to prepare your campaign enquiry, then continue through Lasith’s verified Facebook profile.',social:'Official links available here are Facebook and Instagram @hesh_an25.',about:'Lasith is a digital creator from Galle with a background in Mass Communication and media.'};
  $$('.assistant-options button').forEach(b=>b.addEventListener('click',()=>{const body=$('#assistantBody');body.insertAdjacentHTML('beforeend',`<div class="user-message">${b.textContent}</div><div class="bot-message">${answers[b.dataset.answer]}</div>`);body.scrollTop=body.scrollHeight}));

  $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);sessionStorage.setItem('lasithEnquiryDraft',`Hi Lasith, I'm ${d.get('name')}. ${d.get('type')}: ${d.get('message')} — ${d.get('email')}`);open('https://www.facebook.com/share/18mfixSAkc/?mibextid=wwXIfr','_blank','noopener');$('.contact-form small').textContent='Your draft is ready. The verified Facebook contact channel has opened.'});
})();
