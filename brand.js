(() => {
  // Set the owner's confirmed international number (digits only) when supplied.
  const whatsappNumber = '';
  const button = document.querySelector('#whatsappButton');
  if (/^[1-9]\d{7,14}$/.test(whatsappNumber)) {
    const link=document.createElement('a');
    link.className=button.className;link.innerHTML=button.innerHTML;
    link.href=`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Lasith, I would like to discuss a collaboration.')}`;
    link.target='_blank';link.rel='noopener';link.setAttribute('aria-label','Chat with Lasith on WhatsApp');
    link.querySelector('small').textContent='Let’s talk';button.replaceWith(link);
  }
  if(!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section-label').forEach(label=>gsap.from(label,{x:-18,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:label,start:'top 90%',once:true}}));
  gsap.utils.toArray('.portrait-card img,.stage-visual img').forEach(img=>gsap.fromTo(img,{objectPosition:'50% 22%'},{objectPosition:'50% 32%',ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
})();
