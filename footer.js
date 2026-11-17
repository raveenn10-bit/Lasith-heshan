(() => {
  document.querySelectorAll('.faq-item').forEach(item=>item.addEventListener('toggle',()=>{
    // Native details retains keyboard support and works without JavaScript.
    if(window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());
  }));
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.fromTo('.footer-orbits',{rotation:-18,y:45},{rotation:25,y:-35,ease:'none',scrollTrigger:{trigger:'.signature-footer',start:'top bottom',end:'bottom bottom',scrub:1}});
    gsap.fromTo('.footer-invitation h2',{y:35,opacity:.35},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.footer-invitation',start:'top 95%',end:'top 65%',scrub:.6}});
    gsap.fromTo('.footer-signature',{xPercent:-4,opacity:.25},{xPercent:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.signature-footer',start:'top bottom',end:'bottom bottom',scrub:1}});
  });
})();
