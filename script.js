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

  $('.language').addEventListener('click',e=>{e.currentTarget.textContent=e.currentTarget.textContent==='EN'?'SI':'EN'});
  $('.theme-button').addEventListener('click',e=>{document.documentElement.classList.toggle('extra-soft');e.currentTarget.animate([{transform:'rotate(0)'},{transform:'rotate(180deg)'}],{duration:450})});

  const assistant=$('#assistant'), assistantButton=$('#assistantButton');
  const setAssistant=open=>{assistant.classList.toggle('open',open);assistant.setAttribute('aria-hidden',String(!open));assistantButton.setAttribute('aria-expanded',String(open))};
  assistantButton.addEventListener('click',()=>setAssistant(!assistant.classList.contains('open')));$('#assistantClose').addEventListener('click',()=>setAssistant(false));
  const answers={work:'Use the booking form below to prepare your campaign enquiry, then continue through Lasith’s verified Facebook profile.',social:'Official links available here are Facebook and Instagram @hesh_an25.',about:'Lasith is a digital creator from Galle with a background in Mass Communication and media.'};
  $$('.assistant-options button').forEach(b=>b.addEventListener('click',()=>{const body=$('#assistantBody');body.insertAdjacentHTML('beforeend',`<div class="user-message">${b.textContent}</div><div class="bot-message">${answers[b.dataset.answer]}</div>`);body.scrollTop=body.scrollHeight}));

  $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);sessionStorage.setItem('lasithEnquiryDraft',`Hi Lasith, I'm ${d.get('name')}. ${d.get('type')}: ${d.get('message')} — ${d.get('email')}`);open('https://www.facebook.com/share/18mfixSAkc/?mibextid=wwXIfr','_blank','noopener');$('.contact-form small').textContent='Your draft is ready. The verified Facebook contact channel has opened.'});
})();