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

  if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const blob=document.body.appendChild(document.createElement('div'));blob.className='pointer-blob';let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
    document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    const follow=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;blob.style.left=x+'px';blob.style.top=y+'px';requestAnimationFrame(follow)};follow();
    $$('a,button,input,select,textarea,.archive-card,.stage-card').forEach(el=>{el.addEventListener('mouseenter',()=>blob.classList.add('hot'));el.addEventListener('mouseleave',()=>blob.classList.remove('hot'))});
  }

  $('.language').addEventListener('click',e=>{e.currentTarget.textContent=e.currentTarget.textContent==='EN'?'SI':'EN'});
  $('.theme-button').addEventListener('click',e=>{document.documentElement.classList.toggle('extra-soft');e.currentTarget.animate([{transform:'rotate(0)'},{transform:'rotate(180deg)'}],{duration:450})});

  $('#contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(e.currentTarget);
    const message=`Hi Lasith, I'm ${d.get('name')}.\n${d.get('type')}: ${d.get('message')}\nEmail: ${d.get('email')}`;
    open(`https://wa.me/94765956303?text=${encodeURIComponent(message)}`,'_blank','noopener');
    $('.contact-form small').textContent='Your enquiry is ready in WhatsApp. Review it there and tap Send.';
  });
})();
