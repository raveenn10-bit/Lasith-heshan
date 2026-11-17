(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  window.addEventListener('load', () => setTimeout(() => $('#preloader')?.classList.add('done'), 350));

  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      reveal.unobserve(entry.target);
    }
  }), { threshold: .13, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => reveal.observe(el));

  const counter = $('[data-count]');
  if (counter) {
    const countObs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const target = Number(counter.dataset.count);
      let current = 0;
      const tick = () => {
        current = Math.min(target, current + .1);
        counter.textContent = current.toFixed(1);
        if (current < target) requestAnimationFrame(tick);
      };
      tick(); countObs.disconnect();
    });
    countObs.observe(counter);
  }

  const menuToggle = $('.menu-toggle');
  const menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };
  menuToggle?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  if (matchMedia('(pointer:fine)').matches) {
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let rx = 0, ry = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = `${mx}px`; dot.style.top = `${my}px`; });
    const follow = () => { rx += (mx - rx) * .14; ry += (my - ry) * .14; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; requestAnimationFrame(follow); }; follow();
    $$('a,button,input,select,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
    $$('.magnetic').forEach(el => el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`;
    }));
    $$('.magnetic').forEach(el => el.addEventListener('mouseleave', () => el.style.transform = ''));
  }

  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (innerWidth < 900 || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      $$('[data-parallax]').forEach(el => {
        const x = (e.clientX / innerWidth - .5) * 20;
        el.style.marginLeft = `${x}px`;
      });
      ticking = false;
    });
  });

  const sound = $('.sound-toggle');
  let audioCtx, oscillator, gain;
  sound?.addEventListener('click', () => {
    const active = sound.getAttribute('aria-pressed') === 'true';
    sound.setAttribute('aria-pressed', String(!active));
    sound.querySelector('b').textContent = active ? 'Sound off' : 'Sound on';
    if (!active) {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      oscillator = audioCtx.createOscillator(); gain = audioCtx.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = 54; gain.gain.value = .018;
      oscillator.connect(gain).connect(audioCtx.destination); oscillator.start();
    } else if (oscillator) { oscillator.stop(); oscillator = null; }
  });

  const lightbox = $('#lightbox');
  $$('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
    $('img', lightbox).src = btn.dataset.lightbox;
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
  }));
  const closeLightbox = () => { lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden', 'true'); };
  $('button', lightbox)?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  const assistant = $('#assistant'), assistantButton = $('#assistantButton');
  const setAssistant = open => {
    assistant.classList.toggle('open', open); assistant.setAttribute('aria-hidden', String(!open));
    assistantButton.setAttribute('aria-expanded', String(open));
  };
  assistantButton?.addEventListener('click', () => setAssistant(!assistant.classList.contains('open')));
  $('#assistantClose')?.addEventListener('click', () => setAssistant(false));
  const replies = {
    work: 'Great. Use the enquiry form below to outline the campaign, timing and goals. It will take you to Lasith’s verified Facebook contact channel.',
    social: 'Lasith’s verified links here are Facebook and Instagram @hesh_an25. You’ll find both in the Social Universe section.',
    about: 'Lasith is a digital creator from Galle, studying Mass Communication and developing his voice in Sri Lanka’s media space.',
    media: 'The media kit is being prepared with verified statistics only. Please use the collaboration form to request the current version.'
  };
  $$('.assistant-options button').forEach(button => button.addEventListener('click', () => {
    const body = $('#assistantBody');
    body.insertAdjacentHTML('beforeend', `<div class="user-message">${button.textContent}</div><div class="bot-message">${replies[button.dataset.answer]}</div>`);
    body.scrollTop = body.scrollHeight;
  }));

  $('#contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = `Hi Lasith, I'm ${data.get('name')}. I'm interested in ${data.get('type')}. ${data.get('message')} — Contact: ${data.get('email')}`;
    sessionStorage.setItem('lasithEnquiryDraft', message);
    window.open('https://www.facebook.com/share/18mfixSAkc/?mibextid=wwXIfr', '_blank', 'noopener');
    const note = $('.form-note');
    note.textContent = 'Your enquiry draft is ready. The verified Facebook profile has opened so you can send it securely.';
    note.style.color = '#b60021';
  });
})();
