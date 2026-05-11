/* HomeFood — interactions */
(function () {
  'use strict';

  /* ---------- Lucide icons ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    if (!window.gsap) {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -64 });
            // close mobile drawer if open
            document.getElementById('drawer')?.classList.remove('is-open');
            document.getElementById('burger')?.classList.remove('is-open');
          }
        }
      });
    });
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    drawer.classList.toggle('is-open');
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Add reveal classes to common section pieces
  const revealEls = [
    '.section__head',
    '.feature',
    '.step',
    '.dish',
    '.kuih-card',
    '.num',
    '.story',
    '.bonus',
    '.cov-col',
    '.cta',
    '.faq__list details',
    '.hero__copy',
    '.hero__art',
  ];
  document.querySelectorAll(revealEls.join(',')).forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  // staggered groups
  document.querySelectorAll('.features, .steps, .dishes, .stories, .bonuses, .numbers, .kuih__grid, .footer__grid')
    .forEach(g => {
      g.classList.add('reveal-stagger');
      io.observe(g);
    });

  /* ---------- Number counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const from = 0;

      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = from + (target - from) * eased;
        el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cio.observe(c));

  /* ---------- GSAP parallax bits ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with ScrollTrigger (so scrub animations track smooth scroll)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Hero parallax (apply to wrapper so mouse tilt on phone doesn't conflict)
    gsap.to('.hero__art', {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to('.float-tag--a', { y: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float-tag--b', { y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float-tag--c', { y: 50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Hero blobs subtle drift
    gsap.to('.blob--a', { x: -60, y: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.blob--b', { x: 60, y: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Marquee speed sync (already pure CSS but tune on resize)
    ScrollTrigger.refresh();
  }

  /* ---------- FAQ: close others when one opens ---------- */
  document.querySelectorAll('.faq__list details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('.faq__list details').forEach(other => {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  /* ---------- Cursor magnet for CTAs (subtle) ---------- */
  const magnets = document.querySelectorAll('.btn--primary, .btn--accent, .store-btn');
  magnets.forEach(m => {
    m.addEventListener('mousemove', (e) => {
      const r = m.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${x * 0.08}px, ${y * 0.18}px)`;
    });
    m.addEventListener('mouseleave', () => { m.style.transform = ''; });
  });

  /* ---------- 3D tilt on cards ---------- */
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.style.perspective = '1000px';
      let rect = null;
      const onEnter = () => { rect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        const rx = (-y * 10).toFixed(2);
        const ry = (x * 14).toFixed(2);
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      };
      const onLeave = () => {
        card.style.transform = '';
        rect = null;
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });

    /* Hero phone subtly follows cursor - apply to all hero art elements (both slides) */
    document.querySelectorAll('.hero__slide').forEach(slide => {
      const heroArt = slide.querySelector('.hero__art');
      const heroPhone = slide.querySelector('.phone');
      if (heroArt && heroPhone) {
        heroArt.style.perspective = '1200px';
        heroArt.addEventListener('mousemove', (e) => {
          const r = heroArt.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          heroPhone.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
        });
        heroArt.addEventListener('mouseleave', () => {
          heroPhone.style.transform = '';
        });
      }
    });
  }

  /* ---------- Hero slider (manual-only horizontal carousel) ---------- */
  const heroSection = document.querySelector('.hero--slider');
  if (heroSection) {
    const track = heroSection.querySelector('.hero__track');
    const slides = heroSection.querySelectorAll('.hero__slide');
    const dots = heroSection.querySelectorAll('.hero__dot');
    const toggleBtns = heroSection.querySelectorAll('.hero__toggle-btn');
    const viewport = heroSection.querySelector('.hero__viewport');
    let currentIdx = 0;
    const animatedSet = new WeakSet(); // Prevent re-animating counters

    const animateCounters = (slide) => {
      if (animatedSet.has(slide)) return;
      animatedSet.add(slide);
      const counters = slide.querySelectorAll('[data-count]');
      counters.forEach(c => {
        const target = parseFloat(c.dataset.count);
        const suffix = c.dataset.suffix || '';
        const start = performance.now();
        const dur = 1600;
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          c.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else c.textContent = target + suffix;
        };
        requestAnimationFrame(step);
      });
    };

    const goTo = (idx) => {
      currentIdx = Math.max(0, Math.min(slides.length - 1, idx));

      // Slide the track horizontally
      if (track) track.style.transform = `translateX(-${currentIdx * 100}%)`;

      slides.forEach((s, i) => s.classList.toggle('is-active', i === currentIdx));

      dots.forEach((d, i) => {
        const isActive = i === currentIdx;
        d.classList.toggle('is-active', isActive);
        d.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      toggleBtns.forEach((b, i) => {
        const isActive = i === currentIdx;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Animate counters once they become visible
      animateCounters(slides[currentIdx]);

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch (_) {}
      }
    };

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide, 10);
        goTo(idx);
      });
    });

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.slide, 10);
        goTo(idx);
      });
    });

    // Keyboard navigation
    heroSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(currentIdx - 1);
      if (e.key === 'ArrowRight') goTo(currentIdx + 1);
    });

    // Touch / swipe support
    if (viewport) {
      let startX = 0;
      let startY = 0;
      let isSwiping = false;
      viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      }, { passive: true });
      viewport.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        // Only treat as swipe if mostly horizontal and > 50px
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) goTo(currentIdx + 1);
          else        goTo(currentIdx - 1);
        }
        isSwiping = false;
      }, { passive: true });
    }

    // Initial state
    goTo(0);
  }

  /* ---------- 3D Showcase scroll-driven animation ---------- */
  if (window.gsap && window.ScrollTrigger) {
    const showcase = document.querySelector('.showcase');
    if (showcase) {
      const phone3d = showcase.querySelector('.phone--3d');
      const orbits = showcase.querySelectorAll('.orbit');
      const chips = showcase.querySelectorAll('.stage__chip');

      // Initial state - everything hidden / collapsed behind phone
      gsap.set(orbits, { xPercent: -50, yPercent: -50, scale: .2, opacity: 0, z: -200 });
      gsap.set(chips, { scale: 0, opacity: 0 });

      const sticky = showcase.querySelector('.showcase__sticky');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sticky,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        }
      });

      // Phone rotates in 3D as user scrolls
      tl.fromTo(phone3d,
        { rotateY: -25, rotateX: 8, scale: .85 },
        { rotateY: 25, rotateX: -4, scale: 1, ease: 'none' },
      0);

      // Orbit cards fly in from center to their positions
      orbits.forEach((o, i) => {
        const targets = [
          { x: -360, y: -130, z: 80, ry: 18 },
          { x: 360,  y: -130, z: 120, ry: -18 },
          { x: -340, y: 150,  z: 60,  ry: 15 },
          { x: 340,  y: 150,  z: 100, ry: -15 },
        ][i];
        tl.fromTo(o,
          { scale: .2, opacity: 0, x: 0, y: 0, z: -200, rotateY: 0 },
          { scale: 1, opacity: 1, x: targets.x, y: targets.y, z: targets.z, rotateY: targets.ry, ease: 'power2.out' },
          0.1 + i * 0.08
        );
      });

      // Chips appear later
      tl.to(chips, { scale: 1, opacity: 1, stagger: .1, ease: 'back.out(2)' }, 0.5);
    }
  }

  /* ---------- Live activity toast (psychology: social proof) ---------- */
  const toast = document.getElementById('toast');
  if (toast) {
    const titleEl = document.getElementById('toast-title');
    const textEl  = document.getElementById('toast-text');
    const events = [
      { who: 'Aunty Sarah from Setapak',   what: 'just earned RM45 · 2 min ago' },
      { who: 'Kak Aishah from Subang',     what: 'received an order for Beef Rendang' },
      { who: 'Mak Cik Noor from Klang',    what: 'just hit RM3,200 this month' },
      { who: 'Puan Hasnah from Shah Alam', what: 'joined HomeFood · 12 min ago' },
      { who: 'Kak Liyana from Cheras',     what: 'earned RM67 in the last hour' },
      { who: 'Aunty Maria from Ampang',    what: 'received a 5-star review' },
      { who: 'Mak Cik Rohaya from PJ',     what: 'reached top 10 in Selangor' },
      { who: 'Kak Norma from Kepong',      what: 'sold out her nasi lemak' },
    ];
    let idx = 0;
    const showNext = () => {
      const e = events[idx % events.length];
      titleEl.textContent = e.who;
      textEl.textContent  = e.what;
      toast.classList.add('is-visible');
      setTimeout(() => { toast.classList.remove('is-visible'); }, 4500);
      idx++;
    };
    // first show after 3s, then every 8s
    setTimeout(() => {
      showNext();
      setInterval(showNext, 8000);
    }, 3500);
  }

  /* ---------- Live money counter (psychology: momentum) ---------- */
  const moneyEl = document.querySelector('[data-live-money]');
  if (moneyEl) {
    let value = 1247580; // starting RM earned this week
    const fmt = (n) => 'RM ' + Math.round(n).toLocaleString('en-MY');
    moneyEl.textContent = fmt(value);

    // Animate +RM 12-90 every 1.5-3.5s
    const tick = () => {
      const inc = 12 + Math.random() * 80;
      const target = value + inc;
      const start = performance.now();
      const from = value;
      const dur = 700;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        moneyEl.textContent = fmt(from + (target - from) * eased);
        if (p < 1) requestAnimationFrame(step);
        else value = target;
      };
      requestAnimationFrame(step);
      setTimeout(tick, 1500 + Math.random() * 2000);
    };
    // Only start ticking once visible
    const ob = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (en.isIntersecting) {
          setTimeout(tick, 1200);
          ob.disconnect();
        }
      });
    }, { threshold: .3 });
    ob.observe(moneyEl);
  }
})();
