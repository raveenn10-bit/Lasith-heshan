(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const viewport=document.querySelector('.reviews-window'),track=document.querySelector('.reviews-grid');
  const pause=document.querySelector('#reviewsPause');
  let paused=false,hover=false,focused=false,dragging=false,visible=false,last=0,holdUntil=0,cycle=0,remainder=0;
  // Duplicate visual cards once; assistive technology reads only the originals.
  const originals=[...track.children];
  originals.forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;clone.classList.add('review-copy');track.appendChild(clone)});
  function measure(){cycle=track.children[originals.length].offsetLeft-track.children[0].offsetLeft;if(cycle&&!reduce.matches)viewport.scrollLeft=cycle;}
  new ResizeObserver(measure).observe(viewport);measure();
  new IntersectionObserver(([e])=>{visible=e.isIntersecting},{threshold:0}).observe(viewport);
  pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume automatic reviews':'Pause automatic reviews');pause.textContent=paused?'▶':'Ⅱ'});
  viewport.addEventListener('mouseenter',()=>hover=true);viewport.addEventListener('mouseleave',()=>hover=false);
  viewport.addEventListener('focusin',()=>focused=true);viewport.addEventListener('focusout',()=>focused=false);
  viewport.addEventListener('pointerdown',()=>dragging=true);
  addEventListener('pointerup',()=>{if(dragging){dragging=false;holdUntil=performance.now()+4000}});
  addEventListener('pointercancel',()=>dragging=false);
  viewport.addEventListener('wheel',()=>holdUntil=performance.now()+4000,{passive:true});
  document.querySelectorAll('[data-review-step]').forEach(button=>button.addEventListener('click',()=>{
    holdUntil=performance.now()+5000;
    if(cycle&&viewport.scrollLeft<1)viewport.scrollLeft+=cycle;
    if(cycle&&viewport.scrollLeft>cycle)viewport.scrollLeft-=cycle;
    viewport.scrollBy({left:Number(button.dataset.reviewStep)*Math.min(viewport.clientWidth*.8,400),behavior:reduce.matches?'instant':'smooth'});
  }));
  function tick(now){const dt=Math.min((now-last)/1000,.05);last=now;
    if(visible&&!document.hidden&&!reduce.matches&&!paused&&!hover&&!focused&&!dragging&&now>holdUntil&&cycle){
      // Decreasing scrollLeft makes the cards travel from left to right.
      remainder+=dt*32;const pixels=Math.floor(remainder);remainder-=pixels;viewport.scrollLeft-=pixels;if(viewport.scrollLeft<=0)viewport.scrollLeft+=cycle;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  function motionPreference(){pause.disabled=reduce.matches;pause.title=reduce.matches?'Automatic motion is off for reduced-motion preference':'';if(reduce.matches)viewport.scrollLeft=0;else measure()}
  reduce.addEventListener('change',motionPreference);motionPreference();

  const stack=document.querySelector('.film-stack'),cards=[...stack.querySelectorAll('.film-card')];
  const count=document.querySelector('#filmCount');let index=0,start=null;
  const wrap=n=>(n+cards.length)%cards.length;
  function select(next){index=wrap(next);cards.forEach((card,i)=>{
    const position=wrap(i-index);card.dataset.position=position;card.inert=position!==0;card.setAttribute('aria-hidden',String(position!==0));
    if(position!==0){card.querySelector('video')?.pause();const play=card.querySelector('.film-play');play.setAttribute('aria-label','Play video');}
  });count.textContent=`0${index+1} / 03`;}
  document.querySelector('#filmPrev').addEventListener('click',()=>select(index-1));
  document.querySelector('#filmNext').addEventListener('click',()=>select(index+1));
  stack.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;start={x:e.clientX,y:e.clientY};stack.setPointerCapture(e.pointerId)});
  stack.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))select(index+(dx<0?1:-1))});
  stack.addEventListener('pointercancel',()=>start=null);
  stack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1))}});
  // Add a local data-video-src to each card when the three final clips arrive.
  cards.forEach(card=>{const src=card.dataset.videoSrc,play=card.querySelector('.film-play'),sound=card.querySelector('.film-sound');if(!src)return;
    const video=document.createElement('video');video.src=src;video.poster=card.querySelector('img').src;video.playsInline=true;video.preload='none';video.muted=true;video.loop=true;card.prepend(video);card.querySelector('img').hidden=true;play.disabled=false;sound.hidden=false;card.querySelector('.film-meta p').textContent='Tap to play. Swipe to explore.';play.setAttribute('aria-label','Play video');
    const sync=()=>{play.setAttribute('aria-label',video.paused?'Play video':'Pause video');play.innerHTML=video.paused?'<span aria-hidden="true">▶</span>':'<span aria-hidden="true">Ⅱ</span>'};
    play.addEventListener('click',async()=>{try{if(video.paused)await video.play();else video.pause();sync()}catch{card.querySelector('.film-meta p').textContent='Video could not load. Please try again.'}});
    video.addEventListener('pause',sync);video.addEventListener('play',sync);
    sound.addEventListener('click',()=>{video.muted=!video.muted;sound.setAttribute('aria-label',video.muted?'Unmute video':'Mute video');sound.setAttribute('aria-pressed',String(!video.muted));sound.textContent=video.muted?'♪̸':'♪'});
    new IntersectionObserver(([e])=>{if(!e.isIntersecting)video.pause()}).observe(stack);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
  });select(0);

  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    document.querySelectorAll('.about-title h2,.section-heading h2,.films-copy h2,.reviews-heading h2,.contact-copy h2').forEach(heading=>{
      if(!heading.dataset.split){const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
        heading.setAttribute('aria-label',heading.textContent.trim());nodes.forEach(node=>{const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word)return;const span=document.createElement('span');span.textContent=word;span.className=/^\s+$/.test(word)?'type-word-space':'type-word';span.setAttribute('aria-hidden','true');frag.appendChild(span)});node.replaceWith(frag)});heading.dataset.split='true';}
      gsap.fromTo(heading.querySelectorAll('.type-word'),{yPercent:35,opacity:.3},{yPercent:0,opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:heading,start:'top 94%',end:'top 57%',scrub:.6}});
    });
    gsap.fromTo('.films-visual',{y:35},{y:-15,ease:'none',scrollTrigger:{trigger:'.films',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.fromTo('.film-tape',{x:-20,rotation:-6},{x:20,rotation:-2,ease:'none',scrollTrigger:{trigger:'.films',start:'top bottom',end:'bottom top',scrub:1}});
  });
})();
