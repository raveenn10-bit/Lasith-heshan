(() => {
  const hero=document.querySelector('.sequence-hero');
  const canvas=hero.querySelector('canvas'), ctx=canvas.getContext('2d',{alpha:false});
  const mobile=matchMedia('(max-width:767px)'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(!ctx || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  let cleanup=()=>{};
  function setup(){
    cleanup(); canvas.classList.remove('ready'); hero.classList.remove('is-animated');
    if(reduced.matches) return;
    const mode=mobile.matches?'mobile':'desktop', w=mobile.matches?540:960,h=mobile.matches?960:540;
    canvas.width=w;canvas.height=h;
    let alive=true,target=0,active=0;
    const sheets=new Map(),pending=new Set(),failed=new Set();
    const state={frame:0};
    function draw(){
      target=Math.max(0,Math.min(119,Math.round(state.frame)));
      const sheet=Math.floor(target/10),img=sheets.get(sheet);
      if(img){const cell=target%10;ctx.drawImage(img,(cell%5)*w,Math.floor(cell/5)*h,w,h,0,0,w,h);canvas.classList.add('ready');canvas.dataset.frame=String(target)}
      pump();
    }
    function pump(){
      if(!alive)return;
      const current=Math.floor(target/10);
      for(const i of [current,current+1,current-1]){
        if(active>=2)break;
        if(i<0||i>11||sheets.has(i)||pending.has(i)||failed.has(i))continue;
        pending.add(i);active++;
        const img=new Image();img.decoding='async';
        img.onload=()=>{pending.delete(i);active--;if(!alive)return;sheets.set(i,img);for(const key of sheets.keys())if(Math.abs(key-Math.floor(target/10))>1)sheets.delete(key);draw()};
        img.onerror=()=>{pending.delete(i);active--;failed.add(i);pump()};
        img.src=`assets/sequence/${mode}/sheet-${String(i+1).padStart(2,'0')}.jpg`;
      }
    }
    hero.classList.add('is-animated');
    const context=gsap.context(()=>{
      gsap.from('.sequence-copy > *',{y:25,opacity:0,duration:1,stagger:.12,ease:'power3.out'});
      const timeline=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom bottom',scrub:.35,invalidateOnRefresh:true}});
      timeline.to(state,{frame:119,duration:1,ease:'none',onUpdate:draw},0);
      timeline.to('.sequence-progress',{scaleX:1,duration:1,ease:'none'},0);
      timeline.to('.sequence-copy',{y:mobile.matches?-18:-35,duration:1,ease:'none'},0);
    },hero);
    draw(); ScrollTrigger.refresh();
    cleanup=()=>{alive=false;context.revert();sheets.clear();};
  }
  mobile.addEventListener('change',setup);reduced.addEventListener('change',setup);setup();
})();
