(() => {
  if(!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section-label').forEach(label=>gsap.from(label,{x:-18,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:label,start:'top 90%',once:true}}));
  gsap.utils.toArray('.portrait-card img,.stage-visual img').forEach(img=>gsap.fromTo(img,{objectPosition:'50% 22%'},{objectPosition:'50% 32%',ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
})();
